import { Block } from "./Block";
import { TextBlock } from "./TextBlock";

export class EditorBlock extends Block {
  private blocks: Block[] = [];

  constructor(private elem: HTMLDivElement, initialData = "") {
    super();

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
