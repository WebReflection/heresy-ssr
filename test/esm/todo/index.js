import { ref } from 'heresy';
import Header from './header.js';
import Main from './main.js';
import Footer from './footer.js';

export default {
  // declaration + local components + CSS
  extends: 'section',
  includes: { Header, Main, Footer },
  style: (self /*, Header, Main, Footer*/) => `
    ${self} ul.completed > li:not(.completed),
    ${self} ul.active > li.completed {
      display: none;
    }
  `,

  // lifecycle events
  oninit() {
    console.log('should initt');
    this.data = {
      id: 0,
      items: {
        0: {
          text: 'hello1',
          checked: false,
        },
        1: {
          text: 'two',
          checked: false,
        }
      },
    };
    this.header = ref();
    this.main = ref();
    this.footer = ref();
  },

  // render view
  render() {
    const tot = getCount(this.data.items);
    this.html`
      <Header class="header" ref=${this.header} onchange=${this}/>
      <Main class="main" ref=${this.main} onchange=${this} ondelete=${this} .data=${this.data}/>
      <Footer class="footer" ref=${this.footer} count=${tot} onclick=${this}/>
    `;
  },

  // controller methods
  clearCompleted() {
    const { items } = this.data;
    Object.keys(items).forEach((key) => {
      if (items[key].checked) delete items[key];
    });
  },
  create(text) {
    const id = ++this.data.id;
    this.data.items[id] = { text, checked: false };
  },
  toggleAll(checked) {
    const { items } = this.data;
    Object.keys(items).forEach((key) => {
      items[key].checked = checked;
    });
  },

  // events handling
  onchange(event) {
    console.log('event', event);
    const { currentTarget, target } = event;
    switch (currentTarget) {
      case this.header.current:
        const value = target.value.trim();
        if (value && !getItem(this.data.items, value)) {
          target.value = '';
          this.create(value);
        }
        break;
      case this.main.current:
        if (target.className === 'toggle-all') this.toggleAll(target.checked);
        else {
          const { value } = target.closest('li');
          value.checked = target.checked;
        }
        break;
    }
    this.render();
  },
  ondelete() {
    this.render();
  },
  onclick(event) {
    const { currentTarget, target } = event;
    switch (currentTarget) {
      case this.footer.current:
        if (target.className === 'clear-completed') this.clearCompleted();
        else if (target.hash && !target.classList.contains('selected')) {
          currentTarget.querySelector('a.selected').classList.remove('selected');
          target.classList.add('selected');
          const { list } = this.main.current;
          list.current.classList.remove('active', 'completed');
          const className = target.hash.slice(2);
          if (className) list.current.classList.add(className);
        }
        break;
    }
    this.render();
  },
};

function getCount(items) {
  return Object.keys(items).filter((key) => !items[key].checked).length;
}

function getItem(items, text) {
  return Object.keys(items).some((key) => items[key].text === text);
}
