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

    // Get the previous character if it was a normal character
    // or something like "_" or "**" if it was a mark in-progress:
    const prevChunk = this.chunks.slice(-1)[0];

    // If we were previously typing something like "*"
    // and what we're currently typing would make it into another valid mark like "**"
    // then we modify the value in our array from "*" to "**":
    if (prevChunk !== undefined && (prevChunk + currentChunk) in MarkMap) {
      currentChunk = prevChunk + currentChunk;

      this.chunks[this.chunks.length - 1] = currentChunk;

    // Otherwise, we're starting something new...
    } else {
      // ...so we add that to our array:
      this.chunks.push(currentChunk);

      // Check if we're starting on a new mark and save its index if we are:
      if (currentChunk in MarkMap) {
        this.markIndices.push(this.chunks.length - 1);
      }
    }

    // Get the previous completed mark if it exists...
    const prevMarkIndex = this.markIndices[this.markIndices.length - 2];
    const prevMark = prevMarkIndex !== undefined ? this.chunks[prevMarkIndex] : undefined;

    // ...and check if it matches what we're currently typing:
    if (prevMark && prevMark === currentChunk) {
      // If it is, replace that previous mark and what we're currently typing
      // with the appropriate tags:
      const [openingTag, closingTag] = MarkMap[currentChunk];

      this.chunks[this.chunks.length - 1] = closingTag;
      this.chunks[prevMarkIndex] = openingTag;

      // As these marks have been replaced, we now
      // remove the indices as we no longer need them:
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
