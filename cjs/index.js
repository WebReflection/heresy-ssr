'use strict';
const {
  init,
  CustomElementRegistry,
  Document,
  HTMLElement,
  HTMLTemplateElement
} = require('basichtml');
const {customElements, document, window} = init({});

const csso = (m => m.__esModule ? /* istanbul ignore next */ m.default : /* istanbul ignore next */ m)(require('csso'));

const {
  define: heresyDefine,
  render: heresyRender,
  ref,
  html,
  svg
} = require('heresy');

const CustomElements = (m => m.__esModule ? /* istanbul ignore next */ m.default : /* istanbul ignore next */ m)(require('./custom-elements.js'));

const configurable = true;
const documents = new WeakMap;
let waiting = new Map;
const cleanWait = $ => {
  const doc = window.document || document;
  const styling = documents.get(doc);
  styling && styling.forEach(value => {
    if (value.length) {
      const {head} = doc;
      const style = doc.createElement('style');
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
    const doc = window.document || document;
    const {style} = Class;
    const styling = documents.get(doc) ||
                    documents.set(doc, new Map).get(doc);
    defineProperty(Class, 'style', {
      configurable,
      value() {
        styling.set(Class, csso.minify(style.apply(Class, arguments)).css);
        return '';
      }
    });
  }
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
  switch (true) {
    case where instanceof HTMLElement:
      return cleanWait(heresyRender(where, what));
    case where instanceof Document:
      heresyRender(template, what);
      where.documentElement = template.firstElementChild;
      return cleanWait(where);
    default:
      heresyRender(template, what);
      return where.write(cleanWait(template).innerHTML);
  }
};

exports.CustomElementRegistry = CustomElementRegistry;
exports.Document = Document;
exports.customElements = customElements;
exports.document = document;
exports.define = define;
exports.render = render;
exports.ref = ref;
exports.html = html;
exports.svg = svg;

// make <CustomElements> check available with ease
define('CustomElements', CustomElements);
