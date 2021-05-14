import {ref} from 'heresy';

import List from './list.js';

export default {
  extends: 'section',
  includes: {List},

  mappedAttributes: ['data'],
  ondata() { this.render(); },
  render() {
    this.html`
      <input id="toggle-all" class="toggle-all" type="checkbox">
      <label for="toggle-all">Mark all as complete</label>
      <List
        class="todo-list"
        ref=${ref(this, 'list')}
        .items=${this.data.items}
      />
    `;
  }
};
