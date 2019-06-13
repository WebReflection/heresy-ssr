export default {
  extends: 'body',
  render() {
    this.html`Welcome in <strong>${this.dataset.hostname}</strong>!`;
    console.log(this.outerHTML);
  }
};
