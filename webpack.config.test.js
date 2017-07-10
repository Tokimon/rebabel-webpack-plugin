const nPath = require('path');

module.exports = (env) => {
  return {
    entry: ['babel-polyfill', './test/test.js'],

    output: {
      path: nPath.resolve('test/out'),
      filename: 'test.js?[chunkhash]',
      libraryTarget: 'umd',
      publicPath: 'test/out'
    },

    devtool: 'inline-source-map',

    resolve: {
      extensions: ['.js'],
      modules: [ process.cwd(), nPath.resolve('node_modules') ]
    }
  };
};
