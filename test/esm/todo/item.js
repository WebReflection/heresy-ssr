export default {

  extends: 'li',

  mappedAttributes: ['value'],
  onvalue() { this.render(); },

  onclick(event) {
    event.stopPropagation();
    this.dispatchEvent(new Event('delete', {bubbles: true}));
  },

  render() {
    const {checked, text} = this.value;
    this.classList.toggle('completed', checked);
    this.html`
    <div class="view">
      <input
        class="toggle" type="checkbox"
        checked=${checked}
      >
      <label>${text}</label>
      <button class="destroy" onclick=${this}></button>
    </div>`;
  }
};
