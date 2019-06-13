// for testing purpose to use exact same ESM content
global.heresy = require('../cjs');
require('./cjs/definitions.js');

const {document, render, html} = heresy;

const lang = 'en';
const {hostname} = require('os');
const {readFileSync} = require('fs');

render(document, html`
  <html lang=${lang}>
    <head>
      <title>🔥 heresy SSR 🔥</title>
      <script defer src="//unpkg.com/heresy"></script>
      <script type="module" src="esm/definitions.js"></script>
    </head>
    <Body data-hostname=${hostname}/>
  </html>
`);

require('http').createServer((req, res) => {
  switch (true) {
    case /^\/esm\/.+$/.test(req.url):
      res.writeHead(200, {"content-type": "application/javascript"});
      res.end(readFileSync(`./test${req.url}`));
      break;
    case req.url === '/favicon.ico':
      res.writeHead(404);
      res.end();
      break;
    default:
      res.writeHead(200, {"content-type": "text/html;charset=utf-8"});
      res.end(document.toString());
      break;
  }
}).listen(8080);

console.log('http://localhost:8080/');
