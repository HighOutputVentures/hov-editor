import '@testing-library/jest-dom';
import { EditorBlock, TextBlock } from '../src';

type Context = {
  container: HTMLDivElement;
};

describe('TextBlock', () => {
  beforeEach(function (this: Context) {
    const div = document.createElement('div');

    const editor = new EditorBlock(div);
    this.container = editor.getHTMLElement() as HTMLDivElement;

    const block = new TextBlock(editor, '');
  });

  test('normal text', () => {
    expect(true);
  });
});
