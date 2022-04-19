import { Block } from './Block';
import assert from 'assert';
import { TextBlock } from './TextBlock';

export class EditorBlock extends Block {
  private elem: HTMLDivElement;

  private blocks: Block[] = [];

  constructor(selector: string) {
    super();

    const elem = document.querySelector(selector);

    assert(elem, 'element does not exist');

    assert(elem instanceof HTMLDivElement, 'element must be a div');

    this.elem = elem;

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
