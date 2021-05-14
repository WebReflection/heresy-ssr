const Fragment = {
  extends: 'fragment',
  mappedAttributes: ['hostname'],
  render() {
    this.html`Welcome in <strong>${this.hostname}</strong>!`;
  },
};

export default {
  extends: 'body',
  includes: { Fragment },
  style: (selector) => `
    ${selector} {
      cursor: pointer;
      font-family: sans-serif;
      font-size: 16px;
    }
    ${selector} > strong {
      opacity: .75;
    }
  `,
  oninit() {
    console.log('ggwp');
    // this.addEventListener('onclick', this);
  },
  onclick() {
    console.log('ggwp2');
  },
  render() {
    this.html`<div onclick=${this}>
          Click me
      </div>
    `;
    console.log(this.outerHTML);
  },
};
