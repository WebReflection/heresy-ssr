// original implementation here
// https://svelte.dev/repl/98aa20d4cb3d40dabfef7d8dae183b85?version=3.5.2

const TwitterShare = {
  style: (TS) => `
    ${TS} {
      background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Cpath fill='rgb(29, 161, 242)' class='cls-2' d='M153.62,301.59c94.34,0,145.94-78.16,145.94-145.94,0-2.22,0-4.43-.15-6.63A104.36,104.36,0,0,0,325,122.47a102.38,102.38,0,0,1-29.46,8.07,51.47,51.47,0,0,0,22.55-28.37,102.79,102.79,0,0,1-32.57,12.45,51.34,51.34,0,0,0-87.41,46.78A145.62,145.62,0,0,1,92.4,107.81a51.33,51.33,0,0,0,15.88,68.47A50.91,50.91,0,0,1,85,169.86c0,.21,0,.43,0,.65a51.31,51.31,0,0,0,41.15,50.28,51.21,51.21,0,0,1-23.16.88,51.35,51.35,0,0,0,47.92,35.62,102.92,102.92,0,0,1-63.7,22A104.41,104.41,0,0,1,75,278.55a145.21,145.21,0,0,0,78.62,23'/%3E%3C/svg%3E") 0 50% no-repeat;
      background-size: 1.5em;
      color: rgb(29, 161, 242);
      font-weight: bold;
      padding: 0.5em 0.3em 0.5em 1.5em;
      text-decoration: none;
    }
    ${TS}:hover {
      border-bottom: 2px solid rgb(29, 161, 242);
    }
  `,
  extends: 'a',
  observedAttributes: ['text', 'url', 'hashtags', 'via', 'related'],
  onconnected() { this.addEventListener('click', this); },
  onattributechanged(event) {
    this.setAttribute('href', getHref(this));
    this.setAttribute('noreferrer', '');
    this.textContent = 'Tweet this';
  },
  onclick(e) {
    e.preventDefault();
    const w = 600;
    const h = 400;
    const x = (screen.width - w) / 2;
    const y = (screen.height - h) / 2;
    const features = `width=${w},height=${h},left=${x},top=${y}`;
    window.open(this.href, '_blank', features);
  },

  // overwrites client side onconnected, ignored by heresy client
  // it is possible to fine-tune components on the server side
  // with onSSR/Init/AttributeChanged/Connected/Disconnected
  onSSRConnected() {
    // hard remove observed attributes so that client won't have
    // onattributechanged ever triggered:
    //  * faster bootstrap
    //  * lighter SSR
    // 🎉
    this.attributes = this.attributes.filter(
      attr => !TwitterShare.observedAttributes.includes(attr.name)
    );
  }
};

export default TwitterShare;

function getHref(self) {
  return 'https://twitter.com/intent/tweet?' +
          TwitterShare.observedAttributes.reduce(
            (qs, curr) => {
              const val = self.getAttribute(curr);
              if (val)
                qs.push(curr + '=' + encodeURIComponent(val));
              return qs;
            },
            []
          ).join('&');
}
