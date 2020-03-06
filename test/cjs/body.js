'use strict';
const Fragment = {
  extends: 'fragment',
  mappedAttributes: ['hostname'],
  render() {
    this.html`Welcome in <strong>${this.hostname}</strong>!`;
  }
};

module.exports = {
  extends: 'body',
  includes: {Fragment},
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
    this.html`<Fragment .hostname=${this.dataset.hostname}/>`;
    console.log(this.outerHTML);
  }
};
