import someFunc from './imported';
import common from './common-chunk';

someFunc()
  .then((message) => {
    return import(/* webpackChunkName: "someChunkName" */ './dynamic-import')
      .then((func) => {
        console.log(message);
        console.log('Main:', common());
        return func.default();
      });
  })
  .then((func) => func.default());
