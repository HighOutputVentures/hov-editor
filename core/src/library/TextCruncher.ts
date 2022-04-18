enum MarkType {
  TripleAsterisk = "***",
  DoubleAsterisk = "**",
  Asterisk = "*",
  TripleUnderscore = "___",
  DoubleUnderscore = "__",
  Underscore = "_",
}

const MarkMap: { [key: string]: string[] } = {
  [MarkType.TripleAsterisk]: ["<i><b>", "</b></i>"],
  [MarkType.DoubleAsterisk]: ["<b>", "</b>"],
  [MarkType.Asterisk] : ["<i>", "</i>"],
  [MarkType.TripleUnderscore]: ["<i><b>", "</b></i>"],
  [MarkType.DoubleUnderscore]: ["<b>", "</b>"],
  [MarkType.Underscore] : ["<i>", "</i>"],
}

export class TextCruncher {
  private chunks: string[] = [];
  private markIndices: number[] = [];

  public reset() {
    this.chunks = [];
    this.markIndices = [];
  }

  public ingest(c: string) {
    let currentChunk = c;

    const prevChunk = this.chunks.slice(-1)[0];

    if (prevChunk !== undefined && (prevChunk + currentChunk) in MarkMap) {
      currentChunk = prevChunk + currentChunk;

      this.chunks[this.chunks.length - 1] = currentChunk;

    } else {
      this.chunks.push(currentChunk);

      if (currentChunk in MarkMap) {
        this.markIndices.push(this.chunks.length - 1);
      }
    }

    const prevMarkIndex = this.markIndices[this.markIndices.length - 2];
    const prevMark = prevMarkIndex !== undefined ? this.chunks[prevMarkIndex] : undefined;

    if (prevMark && prevMark === currentChunk) {
      const [openingTag, closingTag] = MarkMap[currentChunk];

      this.chunks[this.chunks.length - 1] = closingTag;
      this.chunks[prevMarkIndex] = openingTag;
      this.markIndices = this.markIndices.slice(0, this.markIndices.length - 2);
    }
  }

  public bulkIngest(s: string) {
    this.reset();

    if (s && s.length > 0) {
      for (const c of s) {
        this.ingest(c);
      }
    }
  }

  public get text() {
    return this.chunks.join('');
  }
}
