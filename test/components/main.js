import someFunc from './imported';
import common from './common-chunk';

export default function *(num) {
  const message = yield someFunc(common({ num }));
  const dynamicFunc = yield import(/* webpackChunkName: "someChunkName" */ './dynamic-import');
  const derrivedFunc = yield dynamicFunc.default();
  return derrivedFunc.default(message);
}
