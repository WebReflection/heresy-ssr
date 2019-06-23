'use strict';
/*
  <CustomElements
    modern="//unpkg.com/@ungap/custom-elements-builtin"
    legacy="//unpkg.com/document-register-element"
  />
*/
Object.defineProperty(exports, '__esModule', {value: true}).default = {
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
      if(this.customElements) {
        try {
          customElements.define('built-in',document.createElement('p').constructor,{'extends':'p'})
        }
        catch (s) {
          document.write(unescape('%3Cscript%20src%3D%22${this.modern}%22%3E%3C/script%3E'))
        }
      }
      else {
        document.write(unescape('%3Cscript%20src%3D%22${this.legacy}%22%3E%3C/script%3E'))
      }
    `.replace(/\s+/g, '');
  }
};