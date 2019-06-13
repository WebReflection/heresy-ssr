'use strict';
const {define} = heresy;

const Body = (m => m.__esModule ? /* istanbul ignore next */ m.default : /* istanbul ignore next */ m)(require('./body.js'));

define('Body', Body);
