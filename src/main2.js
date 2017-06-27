import common from './common-chunk';

console.log('Main 2:', common({ num: 5 }));

import(/* webpackChunkName: "someChunkName2" */ './second-dynamic-file')
  .then((fn) => fn.default());
