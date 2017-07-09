const nPath = require('path');
const webpack = require('webpack');
const { RebabelWebpackPlugin } = require('./cjs.js');
const BabiliPlugin = require('babili-webpack-plugin');

module.exports = (env) => {
  return {
    entry: {
      app: './test/components/main.js',
      app2: './test/components/main2.js'
    },

    output: {
      path: nPath.resolve('test/out'),
      chunkFilename: '[id]-chunk-[name].js?[chunkhash]',
      filename: '[name].js?[chunkhash]',
      libraryTarget: 'umd',
      publicPath: 'out/'
    },

    devtool: false,

    plugins: [
      new BabiliPlugin({
        mangle: true,
        evaluate: true,
        builtIns: true,
        mergeVars: true,
        booleans: true,
        numericLiterals: true
      }),
      new webpack.optimize.CommonsChunkPlugin({
        names: ['app', 'app2'],
        filename: 'shared-[name].js?[chunkhash]',
        minChunks: 2,
        children: true,
        async: false
      }),
      new RebabelWebpackPlugin({
        babel: { presets: ['es2015'], minified: true }
      }),
      new RebabelWebpackPlugin({
        prefix: 'es6-',
        babel: { plugins: ['transform-es2015-modules-commonjs'], minified: true }
      })
    ],

    resolve: {
      extensions: ['.js'],
      modules: [ process.cwd(), nPath.resolve('node_modules') ]
    }
  };
};
