import { EditorBlock } from '@neyar/core';

window.addEventListener('DOMContentLoaded', () => {
  const data = '**bold**<br>__also bold__<br>*italic*<br>~~strike through~~<br>`code`<br>***bold and italic***<br>**bold and _nested italic_**';
  // const data = "aaa<br>bbb";

  const elem = document.querySelector('#editor');

  new EditorBlock(elem, data)
});
