import '@testing-library/jest-dom';
import { EditorBlock } from '../src';

describe('TextBlock', () => {
  beforeEach(() => {
    const div = document.createElement('div');

    const editor = new EditorBlock(div);
    console.log(editor.getHTMLElement().innerHTML);
  });

  test('normal text', () => {
    expect(true);
  })
});