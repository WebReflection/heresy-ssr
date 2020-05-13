import {
  init,
  Document as PlainDocument,
  HTMLElement, HTMLTemplateElement
} from 'basichtml';
const {customElements, document, window} = init({});

import csso from 'csso';

import {
  define as heresyDefine,
  render as heresyRender,
  ref, html, svg
} from 'heresy';

import CustomElements from './custom-elements.js';

const {keys} = Object;
const configurable = true;
const documents = new WeakMap;
const classStyle = new Map;
let waiting = new Map;
const cleanWait = $ => {
  const doc = window.document;
  const styles = documents.get(doc) || documents.set(doc, new Set).get(doc);
  classStyle.forEach((css, Class) => {
    if (css.length && !styles.has(Class)) {
      styles.add(Class);
      const {head} = doc;
      const style = doc.createElement('style');
      style.setAttribute('type', 'text/css');
      style.textContent = css;
      head.insertBefore(style, head.lastChild);
    }
  });
  waiting.forEach(({render, args}, node) => {
    render.apply(node, args);
  });
  waiting = new Map;
  return $;
};

const setStyle = (Class, styled = new Set) => {
  if (styled.has(Class))
    return;
  styled.add(Class);
  if ('style' in Class) {
    const {style} = Class;
    defineProperty(Class, 'style', {
      configurable,
      value() {
        if (!classStyle.has(Class))
          classStyle.set(Class, csso.minify(style.apply(Class, arguments)).css);
        return '';
      }
    });
  }
  const sub = Class.contains || Class.includes;
  if (sub)
    keys(sub).forEach(key => setStyle(sub[key]), styled);
};

const {defineProperty} = Object;
const define = (...args) => {
  const Class = args.length < 2 ? args[0] : args[1];
  setStyle(Class);
  const proto = typeof Class === 'function' ? Class.prototype : Class;
  for (const lifecycle of ['Init', 'Connected', 'Disconnected', 'AttributeChanged']) {
    const ssr = 'onSSR' + lifecycle;
    if (ssr in proto)
      defineProperty(proto, 'on' + lifecycle.toLowerCase(), {
        configurable,
        value: proto[ssr]
      });
  }
  if ('render' in proto) {
    const {render} = proto;
    defineProperty(proto, 'render', {
      configurable,
      value() {
        waiting.set(this, {render, args});
        return this;
      }
    });
  }
  return heresyDefine.apply(null, args);
}

const template = new HTMLTemplateElement;
const render = (where, what) => {
  const {document} = window;
  let result;
  switch (true) {
    case where instanceof HTMLElement:
      window.document = where.ownerDocument;
      try {
        result = cleanWait(heresyRender(where, what));
      }
      catch(error) {
        console.error(error);
      }
      finally {
        window.document = document;
      }
      return result;
    case where instanceof PlainDocument:
      window.document = where;
      try {
        heresyRender(template, what);
        where.documentElement = template.firstElementChild;
        result = cleanWait(where);
      }
      catch(error) {
        console.error(error);
      }
      finally {
        window.document = document;
      }
      return result;
    // RAW fallback, through response.write(...)
    // render(response, html`anything`)
    // TODO: documentation + way to pass a different document
    default:
      heresyRender(template, what);
      return where.write(cleanWait(template).innerHTML);
  }
};

Document.prototype = PlainDocument.prototype;

export {
  // SSR only - You can have one document per page/end point
  Document,
  // also for SSR, don't use `document` within components
  customElements, document, window,
  // specialized for SSR too, not needed within components
  define, render,

  // Exact same heresy helpers, usable in any client/server component
  ref, html, svg
};

// make <CustomElements> check available with ease
define('CustomElements', CustomElements);

function Document() {
  return new PlainDocument(customElements);
}
