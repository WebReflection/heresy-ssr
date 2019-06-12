#!/usr/bin/env node

const {init, HTMLElement, HTMLTemplateElement} = require('basichtml');
const {document} = init({});

const {
  define: heresyDefine,
  render: heresyRender,
  html,
  svg
} = require('heresy');

let waiting = new Map;
const cleanWait = $ => {
  waiting.forEach(({render, args}, node) => {
    render.apply(node, args);
  });
  waiting = new Map;
  return $;
};

const {defineProperty} = Object;
const define = (...args) => {
  const Class = args.length < 2 ? args[0] : args[1];
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
