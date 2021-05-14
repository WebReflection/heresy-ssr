import { hostname } from 'os';
import { readFileSync } from 'fs';
import { createServer } from 'http';
import heresy from '../cjs/index.js';
global.heresy = heresy;
const { document, render, html } = heresy;
import './esm/definitions.js';

const lang = 'en';
render(
  document,
  html`
    <html lang=${lang}>
      <head>
        <title>🔥 heresy SSR 🔥</title>
        <CustomElements />
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script defer src="//unpkg.com/heresy"></script>
        <script type="module" src="esm/definitions.js"></script>
      </head>
      <body data-hostname=${hostname} />
      <Todo />
      <TwitterShare
        text="A Twitter share button with progressive enhancement"
        url="https://github.com/WebReflection/heresy#readme"
        via="webreflection"
      />
    </html>
  `
);

createServer((req, res) => {
  switch (true) {
    case /^\/esm\/.+$/.test(req.url):
      res.writeHead(200, { 'content-type': 'application/javascript' });
      res.end(readFileSync(`./test${req.url}`));
      break;
    case req.url === '/favicon.ico':
      res.writeHead(404);
      res.end();
      break;
    default:
      res.writeHead(200, { 'content-type': 'text/html;charset=utf-8' });
      res.end(document.toString());
      break;
  }
}).listen(8080);

console.log('http://localhost:8080/');
