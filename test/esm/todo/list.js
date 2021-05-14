import {html} from 'heresy';

import Item from './item.js';

export default {

  extends: 'ul',
  includes: {Item},

  mappedAttributes: ['items'],
  onitems() { this.render(); },

  render() {
    const {items} = this;
    this.html`${Object.keys(items).map(
      key => html`<Item ondelete=${this} .value=${items[key]}/>`
    )}`;
  },

  ondelete(event) {
    const {items} = this;
    const {currentTarget} = event;
    const {value} = currentTarget;
    Object.keys(items).forEach(key => {
      if (items[key] === value)
        delete items[key];
    });
  }
};
