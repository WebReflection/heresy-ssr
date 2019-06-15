'use strict';
Object.defineProperty(exports, '__esModule', {value: true}).default = {
  extends: 'body',
  style: (selector) => `
    ${selector} {
      font-family: sans-serif;
      font-size: 16px;
    }
    ${selector} > strong {
      opacity: .75;
    }
  `,
  render() {
    this.html`Welcome in <strong>${this.dataset.hostname}</strong>!`;
    console.log(this.outerHTML);
  }
};
