/*
enum MarkType {
  TripleAsterisk,
  DoubleAsterisk,
  Asterisk,
}

type Mark = {
  type: MarkType;
  index: number;
};
*/

export class TextCruncher {
  // private marks: Mark[] = [];

  private _text: string = '';

  public reset() {}

  public ingest(c: string) {
    this._text += c;
  }

  public bulkIngest(s: string) {
    for (const c of s) {
      this.ingest(c);
    }
  }

  public get text() {
    return this._text;
  }
}