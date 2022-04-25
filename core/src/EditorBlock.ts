import { Block } from "./Block";
import assert from "assert";
import { TextBlock } from "./TextBlock";

export class EditorBlock extends Block {
  private elem: HTMLDivElement;

  private blocks: Block[] = [];

  constructor(selector: string, initialData = "") {
    super();

    const elem = document.querySelector(selector);

    assert(elem, "element does not exist");

    assert(elem instanceof HTMLDivElement, "element must be a div");

    this.elem = elem;

    this.createBlock(initialData);
  }

  public getHTMLElement(): HTMLElement {
    return this.elem;
  }

  public createBlock(data = "", autofocus = false) {
    this.addBlock(new TextBlock(this, data, autofocus));
  }

  public addBlock(block: Block) {
    this.blocks.push(block);

    this.elem.appendChild(block.getHTMLElement());
  }

  public serialize(): [] {
    return [];
  }
}
