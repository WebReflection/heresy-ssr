export default {
  extends: 'header',
  render() {
    this.html`
      <h1>todos</h1>
      <input class="new-todo" placeholder="What needs to be done?" autofocus>
    `;
  }
};
