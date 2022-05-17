export enum BlockEvent {
  Drop = 'DROP',
  Exit = 'EXIT',
}

export abstract class Block extends EventTarget {
  constructor() {
    super();
  }

  public abstract getHTMLElement(): HTMLElement;

  public abstract serialize(): unknown;

  protected onDrop() {
    this.dispatchEvent(new Event(BlockEvent.Drop));
  }

  protected onExit() {
    this.dispatchEvent(new Event(BlockEvent.Exit));
  }
}
