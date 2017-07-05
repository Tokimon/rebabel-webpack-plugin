import common from './common-chunk';

console.log('APP 2');

export default function *(num) {
  const fn = yield import(/* webpackChunkName: "someChunkName2" */ './second-dynamic-file');
  return fn.default(common({ num }));
}
