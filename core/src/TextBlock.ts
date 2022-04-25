import { EditorBlock } from "./EditorBlock";
import { Block } from "./Block";
import TextCruncher from "./library/TextCruncher";
import applyMixins from "./library/mixins";

export class TextBlock {
  private parentEditorBlock: EditorBlock;
  private elem: HTMLDivElement;
  private previousInputWasNewLine = false;
  private previousInnerHtmlLength = 0;

  constructor(parentEditorBlock: EditorBlock, data = "", autofocus = false) {
    this.elem = document.createElement("div");
    this.elem.contentEditable = "true";

    this.elem.innerHTML = this.bulkIngest(data);

    this.parentEditorBlock = parentEditorBlock;

    this.previousInnerHtmlLength = this.elem.innerHTML.length;

    if (autofocus) {
      // "setTimeout" suggested by https://stackoverflow.com/a/37162116
      // .focus() on its own doesn't seem to work, but adding .click() does.
      // Also using .click() on its own also doesn't work
      setTimeout(() => {
        this.elem.focus();
        this.elem.click();
      }, 0);
    }

    this.elem.addEventListener("input", event => this.handleInput(event as InputEvent));
    this.elem.addEventListener('beforeinput', event => this.handleBeforeInput(event as InputEvent));
  }

  private handleBeforeInput = (event: InputEvent) => {
    const { inputType } = event;

    if (inputType === "insertParagraph" && this.parentEditorBlock) {
      event.preventDefault();

      this.parentEditorBlock.createBlock("", true);
    }
  }

  private handleInput = (event: InputEvent) => {
    // If user makes a newline then erases everything,
    // a stray <br> is left which causes incorrect behavior:
    if (this.elem.innerHTML === "<br>") {
      this.elem.innerHTML = "";
    }

    // Reminder: when inputType="insertFromPaste" or "insertParagraph" then data=null.
    let { data, inputType } = event;

    const isInputNewLine =
      inputType === "insertLineBreak" ||
      (inputType === "insertText" && data === null); // this can happen, but forgot how

    // Setting some flags for use later.
    const newInnerHtmlLength = this.elem.innerHTML.length;
    const wereCharactersRemoved = newInnerHtmlLength < this.previousInnerHtmlLength;

    let wereCharactersAppended = false;
    if (!isInputNewLine && data && inputType === "insertText") {
      // NOTE "innerText" can have a trailing "\n" if you've ever added paragraphs.
      wereCharactersAppended = this.elem.innerText.endsWith(data) || this.elem.innerText.endsWith(`${data}\n`);
    }

    // If the user added text to the end, then we can just ingest that text:
    if (!wereCharactersRemoved && data && wereCharactersAppended) {
      let newInnerHtml;

      for (const c of data) {
        newInnerHtml = this.ingest(c, this.previousInputWasNewLine);
      }

      this.setInnerHTMLFromIngest(newInnerHtml);

    // Otherwise, start over and bulk ingest everything.
    } else {
      this.setInnerHTMLFromIngest(this.bulkIngest(this.elem.innerHTML));
    }

    this.previousInputWasNewLine = isInputNewLine;
    this.previousInnerHtmlLength = newInnerHtmlLength;
  }

  // Used to update the innerHTML and there is a chance we may need to move the cursor.
  // Returns "currentHtml !== htmlFromCrusher":
  private setInnerHTMLFromIngest(htmlFromCrusher = ""): boolean {
    // Set it now...
    const currentHtml = this.elem.innerHTML;

    // ...then check if the html the crusher gave us differs from our contenteditable:
    if (currentHtml !== htmlFromCrusher) {
      const oldText = this.elem.innerText || "";
      this.elem.innerHTML = htmlFromCrusher;
      const newText = this.elem.innerText || "";

      // TODO The code below is meant to reposition the cursor
      // as when we modify innerHTML, it moves.
      //
      // While this does currently work:
      //  (1) it is probably inefficient
      //  (2) it does NOT work in IE (https://developer.mozilla.org/en-US/docs/Web/API/Selection/modify)
      //
      // The "correct" answer probably involves Range
      // but I was unable to get that working.
      // Others, feel free to give it a try --Daniel

      const [longerText, shorterText] =
        oldText.length > newText.length
          ? [oldText, newText] // should always be true (for now)
          : [newText, oldText]

      const shorterTextLength = shorterText.length;
      const longerTextLength = longerText.length;

      let a: number, b: number, c: number;

      // Determine how long util the longer (i.e. old) and
      // shorter (i.e. new) text are the same:
      for (a = 0; a < shorterTextLength; a++) {
        if (longerText[a] !== shorterText[a]) break;
      }

      // Determine how long the longer text
      // stays different from the shorter one:
      for (b = 0; (a+b) < longerTextLength; b++) {
        if (longerText[a+b] === shorterText[a]) break;
      }

      // Determine how long after that the longer and
      // shorter text are the same:
      for (c = 0; (a+c) < shorterTextLength; c++) {
        if (longerText[a+b+c] !== shorterText[a+c]) break;
      }

      const maxI = a + c;

      const sel = window.getSelection();

      if (sel) {
        sel.extend(this.elem, 0);
        for (let i = 0; i < maxI; i++) {
          // @ts-expect-error
          sel.modify("move", "forward", "character");
        }
      }

      return true;
    }
    return false;
  }

  public getHTMLElement(): HTMLElement {
    return this.elem;
  }

  public serialize(): string {
    return this.html;
  }
}

export interface TextBlock extends Block, TextCruncher {}

applyMixins(TextBlock, [Block, TextCruncher]);
