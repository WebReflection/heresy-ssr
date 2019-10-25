/*
  <CustomElements
    modern="//unpkg.com/@ungap/custom-elements-builtin"
    legacy="//unpkg.com/document-register-element"
  />
*/
export default {
  extends: 'script',
  get legacy() {
    return this.getAttribute('modern') || '//unpkg.com/document-register-element';
  },
  get modern() {
    return this.getAttribute('modern') || '//unpkg.com/@ungap/custom-elements-builtin';
  },
  onSSRConnected() {
    this.attributes = [];
    this.textContent = `
    (function(w, d, c){
      try {
        w[c].define('built-in', d.createElement('p').constructor, {'extends':'p'})
      }
      catch (e) {
        d.write(
          unescape(
            '%3Cscript%20src%3D%22' +
            (w[c] ? '${this.modern}' : '${this.legacy}') +
            '%22%3E%3C/script%3E'
          )
        )
      }
    }(this, document, 'customElements'))
    `.replace(/\s+/g, '');
  }
};
