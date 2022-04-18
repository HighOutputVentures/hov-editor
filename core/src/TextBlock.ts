import { Block } from "./Block";

export class TextBlock extends Block {
  private elem: HTMLDivElement;

  constructor(private data: string) {
    super();

    this.elem = document.createElement("div");
    this.elem.contentEditable = "true";

    this.render();
  }

  private render() {
    let html = this.data;
    
    html = html.replace(/\*{3}([^*]+)\*{3}/g, "<b><i>$1</i></b>");

    html = html.replace(/\*{2}([^*]+)\*{2}/g, "<b>$1</b>");
    html = html.replace(/\_{2}([^_]+)\_{2}/g, "<b>$1</b>");

    html = html.replace(/\~{2}([^~]+)\~{2}/g, "<del>$1</del>");

    console.log(this.data);

    this.elem.innerHTML = html;
  }

  public getHTMLElement(): HTMLElement {
    return this.elem;
  }

  public serialize(): string {
    return this.data;
  }
}
