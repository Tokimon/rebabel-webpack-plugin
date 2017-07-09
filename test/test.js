/* global ok */

const co = require('co');
const test = require('kludjs');
const app = require('./out/shared-app.js');
const app2 = require('./out/shared-app2.js');
const appES5 = require('./out/es5-shared-app.js');
const app2ES5 = require('./out/es5-shared-app2.js');


test('es6', (next) => {
  co(app.default(5))
    .then((message) => {
      ok(message === 'Message: Imported: 13 - Number: 3', 'Got APP message');
      return co(app2.default(5));
    })
    .then((message) => {
      ok(message === 'Message: 8 - Number: 3', 'Got APP 2 message');
      next();
    })
    .catch((err) => {
      console.error(err);
      ok(false, 'Oh no something happened');
    });
}, true);

test('es5', () => {
  co(appES5.default(5))
    .then((message) => {
      ok(message === 'Message: Imported: 13 - Number: 3', 'Got APP message');
      return co(app2ES5.default(5));
    })
    .then((message) => {
      ok(message === 'Message: 8 - Number: 3', 'Got APP 2 message');
    })
    .catch((err) => {
      console.error(err);
      ok(false, 'Oh no something happened');
    });
}, true);
