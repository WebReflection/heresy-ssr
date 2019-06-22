const {document, define, render, html} = require('../cjs');
const {default: TwitterShare} = require('./cjs/twitter-share');

// generic document head setup
render(document.head, html`
  <title>🔥 heresy SSR 🔥 TwitterShare Example</title>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <!--👻 remember to include the polyfills if targeting legacy or Safari -->
  <CustomElements />
  <!--👻 default basic styles can be sent right away through the page -->
  <style>
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI",
                  Roboto, Oxygen-Sans, Ubuntu, Cantarell,
                  "Helvetica Neue", sans-serif;
  }
  </style>
  <!--👻
    heresy can land in this page at any time,
    it's the component definition that matters
  -->
  <script async type="module">
  import {define, render, html} from 'https://unpkg.com/heresy?module';
  import TwitterShare from '/esm/twitter-share.js';
  // that's it, rehydration out of the box
  define('TwitterShare', TwitterShare);
  // for testing purpose
  window.heresy = {render, html};
  </script>`
);

// define the component like a Custom Element
define('TwitterShare', TwitterShare);

// and use it whenever you want
render(document.body, html`
  <TwitterShare
    text="A Twitter share button with progressive enhancement"
    url="https://github.com/WebReflection/heresy#readme"
    via="webreflection"
  />`
);

// spin a server to test this
require('http').createServer((req, res) => {
  switch (true) {
    case /^\/esm\/.+$/.test(req.url):
      res.writeHead(200, {"content-type": "application/javascript"});
      res.end(require('fs').readFileSync(`./test${req.url}`));
      break;
    default:
      res.writeHead(200, {"content-type": "text/html;charset=utf-8"});
      res.end(document.toString());
      break;
  }
}).listen(8080);

console.log('http://localhost:8080/');
