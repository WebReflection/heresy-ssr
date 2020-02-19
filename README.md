# ![heresy logo](heresy.png) heresy SSR
Don't simulate the DOM. Be the DOM.
- - -
<sup>**Social Media Photo by [Thomas Kelley](https://unsplash.com/@thkelley) on [Unsplash](https://unsplash.com/)**</sup>

![WebReflection status](https://offline.report/status/webreflection.svg) [![License: ISC](https://img.shields.io/badge/License-ISC-yellow.svg)](https://opensource.org/licenses/ISC) [![Build Status](https://travis-ci.com/WebReflection/heresy-ssr.svg?branch=master)](https://travis-ci.com/WebReflection/heresy-ssr) [![Greenkeeper badge](https://badges.greenkeeper.io/WebReflection/heresy-ssr.svg)](https://greenkeeper.io/)

It's pretty much the same [heresy](https://github.com/WebReflection/heresy#readme), but for the server, and with extra features.

### How To Install Without Canvas

If you don't need/want to use the `<canvas>` element, which is an optional dependency of [basicHTML](https://github.com/WebReflection/basicHTML#readme), you can use:

```sh
# install heresy-ssr without canvas
npm i --no-optional heresy-ssr
```

If you'd like to use the `<canvas>` element too, simply:

```sh
# install heresy-ssr with canvas
npm i heresy-ssr
```

## Extra Features

  * dedicated `onSSRInit/AttributeChanged/Connected/Disconnected` methods to override client side `oninit/attributechanged/connected/disconnected`, in order to fine-tune, whenever necessary, the layout and behavior via SSR
  * an already available `<CustomELement/>` tag to put in the header, whenever polyfills for legacy or WebKit/Safari are needed. The component accepts `modern` and `legacy` attributes as pointers to polyfills, loaded only after feature detection to leave Chrome, Firefox, and Edge on Chromium free of bloat.
  * components style automatically minified via [csso](https://www.npmjs.com/package/csso)
  * global `customElements` or `document`, swappable on the `window` with any local instance of `Document` or `CustomElementRegistry`


### Basic Example

You can see inside the [test folder](./test) a similar example you can run via `npm run build` or just `npm test`, after the first build.

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
      <CustomElements/>
      <script defer src="//unpkg.com/heresy"></script>
      <script type="module" src="definitions.js"></script>
    </head>
    <Body data-hostname=${hostname}/>
  </html>
`);
```

You can also try `node test/twitter-share.js` to see an example of a component served through the same definition crystal clean via SSR, but still re-hydrated on the client whenever the definition lands on the page.

## Multiple Documents

The default `document` is ideal for **S**ingle **P**age **A**pplications but not optimal for sites distributed through various pages.

In latter scenario, you can use a new document per each render.

```js
const {Document, render, html} = require('heresy-ssr');

// create a new document related to this page only
const document = new Document;

render(document, html`<h1>Hello</h1>`);
```


## Project Goals

  * reuse exact same components on client as well as on the server, with the ability to provide cleaner layouts via SSR
  * hydration on the fly without even thinking about it, whenever the definition lands on the client, it just works<sup>™️</sup>
  * Custom Elements and built-in extends out of the box for any sort of client/server need
  * you work on the server with same DOM primitives you know on the client, but you can also create as many documents you want, so that each page is reflected by a different, always clean document

### Differences from viperHTML

There are tons of differences with viperHTML at this stage:

  * the template literal parser is exactly the same one used on the client (slower cold bootstrap, but damn fast hot renders)
  * the code is exactly the same one used by the client library, with minor tweaks specific for SSR usage only
  * viperHTML never really provided proper re-hydration for hyperHTML, while here this is provided natively by the Web platform, and it works better than anything else, specially with custom elements builtin
