const {Document, document, render, html} = require('../cjs');

const defaultDocument = render(document, html`<CustomElements />`).toString();
const newDocument1 = render(new Document, html`<CustomElements />`).toString();
const newDocument2 = render(new Document, html`<CustomElements />`).toString();

console.assert(defaultDocument === newDocument1 && newDocument1 === newDocument2, 'unexpected layout');

console.log('\x1b[1mOK\x1b[0m');
console.log(defaultDocument);
