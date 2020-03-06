const {Document, define, render, html} = require('../cjs');

define('MyStyle', {
  style: MyStyle => `
  ${MyStyle} { font-family: sans-serif; }
  `
});

const defaultDocument = render(document, html`
<html>
  <head></head>
  <body><MyStyle /></body>
</html>`).toString();

const newDoc1 = new Document;
const newDocument1 = render(newDoc1, html`
<html>
  <head></head>
  <body><MyStyle /></body>
</html>`).toString();

const newDoc2 = new Document;
const newDocument2 = render(newDoc2, html`
<html>
  <head></head>
  <body><MyStyle /></body>
</html>`).toString();

const newDoc3 = new Document;
const multiPass = doc => render(doc, html`
<html>
  <head></head>
  <body><MyStyle /></body>
</html>`).toString();

console.assert(defaultDocument === newDocument1 && newDocument1 === newDocument2, 'unexpected inline layout');
console.assert(multiPass(newDoc3) === multiPass(newDoc3) && newDocument1 === multiPass(newDoc3), 'unexpected scoped layout');

console.log('\x1b[1mOK\x1b[0m');
