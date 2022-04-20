import { TextBlock } from '@neyar/core';

window.addEventListener('DOMContentLoaded', () => {
  const data = '**bold**<br>__also bold__<br>*italic*<br>~~strike through~~<br>`code`<br>***bold and italic***<br>**bold and nested _italic_**';

  const editor = document.getElementById('editor');

  const text = new TextBlock(data);

  editor.appendChild(text.getHTMLElement());
});
