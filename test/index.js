// for testing purpose to use exact same ESM content
global.heresy = require('../cjs');

const {document, render, html} = heresy;
require('./cjs/definitions.js');

const lang = 'en';
const {hostname} = require('os');
const {readFileSync} = require('fs');

render(document, html`
  <html lang=${lang}>
    <head>
      <title>🔥 heresy SSR 🔥</title>
      <CustomElements/>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
