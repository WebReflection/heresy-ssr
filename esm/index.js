import {init, HTMLElement, HTMLTemplateElement} from 'basichtml';
const {document} = init({});

import {
  define as heresyDefine,
  render as heresyRender,
  html, svg
} from 'heresy';

const documents = new WeakMap;
let waiting = new Map;
const cleanWait = $ => {
  const styling = documents.get(document);
  styling && styling.forEach(value => {
    if (value.length) {
      const {head} = document;
      const style = document.createElement('style');
      style.setAttribute('type', 'text/css');
      style.textContent = value;
      head.insertBefore(style, head.lastChild);
    }
  });
  waiting.forEach(({render, args}, node) => {
    render.apply(node, args);
  });
  waiting = new Map;
  return $;
};

const {defineProperty} = Object;
const define = (...args) => {
  const Class = args.length < 2 ? args[0] : args[1];
  if ('style' in Class) {
    const {style} = Class;
    const styling = documents.get(document) ||
                    documents.set(document, new Map).get(document);
    defineProperty(Class, 'style', {
      value() {
        styling.set(Class, style.apply(Class, arguments));
        return '';
      }
    });
  }
  const proto = typeof Class === 'function' ? Class.prototype : Class;
  for (const lifecycle of ['Init', 'Connected', 'Disconnected', 'AttributeChanged']) {
    const ssr = 'onSSR' + lifecycle;
    if (ssr in proto)
      defineProperty(proto, 'on' + lifecycle.toLowerCase(), {
        configurable: true,
        value: proto[ssr]
      });
  }
  if ('render' in proto) {
    const {render} = proto;
    defineProperty(proto, 'render', {
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
  switch (true) {
    case where instanceof HTMLElement:
      return cleanWait(heresyRender(where, what));
    case where === document:
      heresyRender(template, what);
      document.documentElement = template.firstElementChild;
      return cleanWait(document);
    default:
      heresyRender(template, what);
      return where.write(cleanWait(template).innerHTML);
  }
};

export {document, define, render, html, svg};
