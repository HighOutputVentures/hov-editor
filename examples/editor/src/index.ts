import { EditorBlock, TextBlock } from '@neyar/core';

window.addEventListener('DOMContentLoaded', () => {
  const data = '**bold**<br>__also bold__<br>*italic*<br>~~strike through~~<br>`code`<br>***bold and italic***<br>**bold and _nested italic_**';

  const editor = new EditorBlock('#editor');
  
  editor.addBlock(new TextBlock(data));
});
