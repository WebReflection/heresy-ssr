#!/usr/bin/env node

const {init, HTMLElement, HTMLTemplateElement} = require('basichtml');
const {document} = init({});

const {
  define: heresyDefine,
  render: heresyRender,
  html,
  svg
} = require('heresy');

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

exports.document = document;
exports.define = define;
exports.render = render;
exports.html = html;
exports.svg = svg;
