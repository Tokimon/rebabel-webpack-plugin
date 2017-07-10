const nPath = require('path');
const webpack = require('webpack');
const { RebabelWebpackPlugin } = require('./cjs.js');
const BabiliPlugin = require('babili-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const AssetsPlugin = require('assets-webpack-plugin');

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
        babel: {
          // presets: [['es2015', { loose: true }]],
          plugins: [
            'check-es2015-constants',
            'transform-es2015-arrow-functions',
            'transform-es2015-block-scoped-functions',
            'transform-es2015-block-scoping',
            'transform-es2015-classes',
            'transform-es2015-computed-properties',
            'transform-es2015-destructuring',
            'transform-es2015-duplicate-keys',
            'transform-es2015-for-of',
            // 'transform-es2015-function-name',
            'transform-es2015-literals',
            'transform-es2015-modules-commonjs',
            'transform-es2015-object-super',
            'transform-es2015-parameters',
            'transform-es2015-shorthand-properties',
            'transform-es2015-spread',
            'transform-es2015-sticky-regex',
            'transform-es2015-template-literals',
            'transform-es2015-typeof-symbol',
            'transform-es2015-unicode-regex',
            'transform-regenerator'
          ],
          minified: false
        },
        resolveChunk: true
      }),
      new RebabelWebpackPlugin({
        prefix: 'es6-',
        babel: { plugins: ['transform-es2015-modules-commonjs'], minified: true }
      }),
      new BundleAnalyzerPlugin({
        openAnalyzer: false,
        analyzerMode: 'static'
      }),
      new AssetsPlugin({
        filename: 'assets.json',
        fullPath: true,
        path: nPath.resolve('test/out')
      })
    ],

    resolve: {
      extensions: ['.js'],
      modules: [ process.cwd(), nPath.resolve('node_modules') ]
    }
  };
};
