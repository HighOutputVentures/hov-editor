import { Block } from "./Block";
import TextCruncher from "./library/TextCruncher";
import applyMixins from "./library/mixins";

export class TextBlock {
  private elem: HTMLDivElement;

  constructor(data = "") {
    this.elem = document.createElement("div");
    this.elem.contentEditable = "true";

    this.elem.innerHTML = this.bulkIngest(data);

    this.elem.addEventListener("input", event => {
      this.setInnerHTML(this.bulkIngest(this.elem.innerHTML));
    })
  }

  private setInnerHTML(newHtml = ""): boolean {
    const oldHtml = this.elem.innerHTML;

    if (oldHtml !== newHtml) {
      const oldText = this.elem.innerText || "";
      this.elem.innerHTML = newHtml;
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

      const sel = window.getSelection();

      if (sel) {
        sel.extend(this.elem, 0);
        for (let i = 0; i < (a+c); i++) {
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
    return this.text;
  }
}

export interface TextBlock extends Block, TextCruncher {}

applyMixins(TextBlock, [Block, TextCruncher]);
