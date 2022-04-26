import { Block } from './Block';
import { TextBlock } from './TextBlock';

export class EditorBlock extends Block {
  private blocks: Block[] = [];

  constructor(private elem: HTMLDivElement) {
    super();

    this.addBlock(new TextBlock(''));
  }

  public getHTMLElement(): HTMLElement {
    return this.elem;
  }

  public addBlock(block: Block) {
    this.blocks.push(block);

    this.elem.appendChild(block.getHTMLElement());
  }

  public serialize(): [] {
    return [];
  }
}
