#!/usr/bin/env node

import {init, HTMLElement, HTMLTemplateElement} from 'basichtml';
const {document} = init({});

import {
  define as heresyDefine,
  render as heresyRender,
  html, svg
} from 'heresy';

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

export {document, define, render, html, svg};
