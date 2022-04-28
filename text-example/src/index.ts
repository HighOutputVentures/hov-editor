import { TextBlock } from '@neyar/core';

window.addEventListener('DOMContentLoaded', () => {
  const data = '**bold** __also bold__ *italic* ~~strike through~~ `code` ***bold and italic*** **bold and nested _italic_** aaa bbb';

  const editor = document.getElementById('editor');

  const text = new TextBlock(undefined, data);

  editor.appendChild(text.getHTMLElement());
});
