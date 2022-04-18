enum MarkType {
  DoubleAsterisk = "**",
  Asterisk = "*",
  DoubleUnderscore = "__",
  Underscore = "_",
}

const MarkMap: { [key: string]: string[] } = {
  [MarkType.DoubleAsterisk]: ["<b>", "</b>"],
  [MarkType.Asterisk] : ["<i>", "</i>"],
  [MarkType.DoubleUnderscore]: ["<b>", "</b>"],
  [MarkType.Underscore] : ["<i>", "</i>"],
}

export class TextCruncher {
  private marks: MarkType[] = [];

  private _text: string = '';

  public reset() {
    this._text = '';
    this.marks = [];
  }

  private getPrevMarkAndIndex = (): [MarkType, number] =>
    [this.marks.splice(-1)[0], this.marks.length - 1]

  public ingest(c: string) {
    let marksUpdated = false;

    const [prevMark, prevMarkIndex] = this.getPrevMarkAndIndex();

    if (prevMark !== undefined) {
      const prevMarkInput = MarkMap[prevMark];

      if ((prevMarkInput + c) in MarkMap) {
        this.marks[prevMarkIndex] = prevMarkInput + c as MarkType;
        marksUpdated = true;
      }
    }

    if (!marksUpdated) {
      if (c in MarkMap) {
        this.marks.push(c as MarkType);
      }
    }

    this._text += c;
  }

  public bulkIngest(s: string) {
    this.marks = [];

    for (const c of s) {
      this.ingest(c);
    }
  }

  public get text() {
    return this._text;
  }
}
