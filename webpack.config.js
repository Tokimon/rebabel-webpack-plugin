const nPath = require('path');
const RebabelWebpackPlugin = require('./');
const BabiliPlugin = require('babili-webpack-plugin');

module.exports = (env) => {
  return {
    entry: {
      app: './src/main.js',
      app2: './src/main2.js'
    },

    output: {
      path: nPath.resolve('public'),
      chunkFilename: '[id]-chunk-[name].js?[chunkhash]',
      filename: '[name].js?[chunkhash]',
      libraryTarget: 'umd',
      publicPath: 'public/'
    },

    devtool: 'inline-source-map',

    module: {
      rules: []
    },

    plugins: [
      new BabiliPlugin({
        mangle: true,
        evaluate: true,
        builtIns: true,
        mergeVars: true,
        booleans: true,
        numericLiterals: true
      }),
      new RebabelWebpackPlugin({
        babel: { presets: ['es2015'], minified: true }
      })
    ],

    resolve: {
      extensions: ['.js'],
      modules: [ process.cwd(), nPath.resolve('node_modules'), nPath.resolve('src') ]
    }
  };
};
