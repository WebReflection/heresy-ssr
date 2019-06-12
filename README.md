# 🔥 heresy 🔥 SSR

Don't simulate the DOM. Be the DOM.

- - -

It's pretty much the same [heresy](https://github.com/WebReflection/heresy#readme), but for the server.

## Current State

The project is at its primitive state, so it needs quite some extra test, but the basics should be in already.

### Basic Example

You can ses inside the [test folder](./test) a similar example you can run via `npm run build` or just `npm test`, after the first build.

```js
const {document, render, html} = require('heresy-ssr');

const Body = require('./body.js');
define('Body', Body);

const lang = 'en';
const {hostname} = require('os');
const {readFileSync} = require('fs');

render(document, html`
  <html lang=${lang}>
    <head>
      <title>🔥 heresy SSR 🔥</title>
      <script defer src="//unpkg.com/heresy"></script>
      <script type="module" src="definitions.js"></script>
    </head>
    <Body data-hostname=${hostname}/>
  </html>
`);
```

## Project Goals

  * reuse exact same components on client as well on the server
  * hydration on the fly without even thinking about it
  * Custom Elements and built-in extends out of the box
  * you work on the server with same DOM primitives you know on the client
