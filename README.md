# 🔥 heresy 🔥 SSR
Don't simulate the DOM. Be the DOM.
- - -
<sup>**Social Media Photo by [Thomas Kelley](https://unsplash.com/@thkelley) on [Unsplash](https://unsplash.com/)**</sup>

It's pretty much the same [heresy](https://github.com/WebReflection/heresy#readme), but for the server, and with extra features.


## Extra Features

  * dedicated `onSSRInit/AttributeChanged/Connected/Disconnected` methods to override client side `oninit/attributechanged/connected/disconnected`, in order to fine-tune, whenever necessary, the layout and behavior via SSR
  * an already available `<CustomELement/>` tag to put in the header, whenever pilyfills for legacy or WebKit/Safari are needed. The component accepts `modern` and `legacy` attributes as pointers to polyfills, loaded only after feature detection to leave Chrome, Firefox, and Edge on Chromium free of bloat.


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
