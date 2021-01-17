const http = require('http');
const {document, render, html, define} = require('../cjs');

let firstElemInits = 0;
let secondElemInits = 0;
let thirdElement = 0;

const FirstElement = {
  name: 'FirstElement',
  extends: 'element',
  oninit() {
    console.log('FirstElement init:', ++firstElemInits);
  },
  render() {
    this.html`FirstElement: ${ firstElemInits }`;
  }
}
const SecondElement = {
  name: 'SecondElement',
  extends: 'button',
  oninit() {
    console.log('SecondElement init:', ++secondElemInits);
  },
  render() {
    this.html`SecondElementID: ${ secondElemInits }`;
  }
}
const ThirdElement = {
  name: 'ThirdElement',
  extends: 'element',
  oninit() {
    console.log('ThirdElement init:', ++thirdElement);
  },
  render() {
    this.html`ThirdElementID: ${ thirdElement }`;
  }
}

define(FirstElement);
define(SecondElement);
define(ThirdElement);

render(document.body, html`
  <FirstElement />
  <SecondElement />
  <ThirdElement />
`);

const server = http.createServer(function(req, res) {
  res.writeHead(200, {"content-type": "text/html;charset=utf-8"});
  res.end(document.toString());
}).listen(8080, () => console.log("server running"))