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

type MarkGroup = {
  mark: MarkType;
  startIndex: number;
  length: number;
}

export class TextCruncher {
  private chunks: string[] = [];
  private markGroups: MarkGroup[] = [];

  public reset() {
    this.chunks = [];
    this.markGroups = [];
  }

  public ingest(c: string) {
    // Append the current character to the array of "chunks":
    this.chunks.push(c);

    // Get the last two "mark groups" if they exists:
    let [currentMarkGroup, prevMarkGroup] = this.markGroups.slice(-2).reverse();

    // If we were previously typing a mark (e.g. *)
    // and what we're currently typing would "continue" the mark (e.g. **)
    // then we update the "endIndex" of the previous "mark group":
    const shouldUpdateCurrentMarkGroup =
      currentMarkGroup !== undefined &&
      currentMarkGroup.startIndex + currentMarkGroup.length + 1 === this.chunks.length &&
      currentMarkGroup.mark === c;

    if (shouldUpdateCurrentMarkGroup) {
      this.markGroups[this.markGroups.length - 1].length++;

    // Otherwise, we're starting something new:
    } else {
      // Check if we're starting on a new mark
      // and create a new "mark group" if yes:
      if (c in MarkMap) {
        const newMarkGroup = {
          mark: c as MarkType,
          startIndex: this.chunks.length - 1,
          length: 1,
        };

        this.markGroups.push(newMarkGroup);

        // Change which "mark groups" are considered
        // the previous and current:
        prevMarkGroup = currentMarkGroup;
        currentMarkGroup = newMarkGroup;
      }
    }

    // If we have a previous and current "mark group":
    if (prevMarkGroup && currentMarkGroup) {
      // Check if they have the same mark (e.g. *) and length:
      if (
        prevMarkGroup.mark === currentMarkGroup.mark &&
        prevMarkGroup.length === currentMarkGroup.length
      ) {
        // Get the tags to replace the marks with...
        const [openingTags, closingTags] = MarkMap[
          currentMarkGroup.mark.repeat(currentMarkGroup.length)
        ];

        // ...then replace the chunks with the relevant tags.
        this.chunks.splice(
          prevMarkGroup.startIndex,
          prevMarkGroup.length,
          openingTags
        );

        this.chunks.splice(
          currentMarkGroup.startIndex - prevMarkGroup.length + 1,
          currentMarkGroup.length,
          closingTags
        );

        // As these marks have been replaced, we now
        // remove those "mark groups" as we no longer need them:
        this.markGroups = this.markGroups.slice(0, this.markGroups.length - 2);
      }
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
