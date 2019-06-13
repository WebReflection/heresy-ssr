'use strict';
Object.defineProperty(exports, '__esModule', {value: true}).default = {
  extends: 'body',
  render() {
    this.html`Welcome in <strong>${this.dataset.hostname}</strong>!`;
    console.log(this.outerHTML);
  }
};
