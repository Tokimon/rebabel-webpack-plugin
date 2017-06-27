const babel = require('babel-core');
const { SourceMapSource, RawSource } = require('webpack-sources');

class RebabelWebpackPlugin {
  constructor({ babel: babelConfig = {}, prefix = 'es5-' } = {}) {
    this.options = {
      babel: Object.assign({ sourceType: 'script' }, babelConfig),
      prefix
    };
  }

  apply(compiler) {
    const { babel: babelConfig, prefix } = this.options;

    if(typeof babelConfig.sourceMaps === 'undefined') {
      babelConfig.sourceMaps = !!compiler.options.devtool;
    }

    compiler.plugin('after-compile', (compilation, cb) => {
      const { assets, chunks, additionalChunkAssets } = compilation;

      const files = chunks.reduce((arr, chunk) => (chunk.rendered ? arr.concat(chunk.files) : arr), []);
      files.push(...additionalChunkAssets);

      const transpiles = files
        .filter((file) => !!assets[file])
        .map((file) => new Promise((resolve, reject) => {
          try {
            const asset = assets[file];
            let source = {
              source: asset.source(),
              map: null
            };

            if(babelConfig.sourceMaps) {
              source = asset.sourceAndMap
                ? asset.sourceAndMap()
                : { map: asset.map(), source: asset.source() };
            }

            let { code, map } = babel.transform(asset.source(), babelConfig);

            const es5File = `${prefix}${file}`;
            code = code.replace(/\b(script|\w).src\s*=\s*(__webpack_require__|\w).p\s*\+\s*["']/, `$&${prefix}`);

            assets[es5File] = map
              ? new SourceMapSource(code, file, map, source.source, source.map)
              : new RawSource(code);

            resolve(es5File);
          } catch(err) { reject(err); }
        }));

      Promise.all(transpiles)
        .then(() => cb())
        .catch((err) => {
          err.message = `Re-Babel: ${err.message}`;
          compilation.errors.push(err);
          cb();
        });
    });
  }
}

module.exports = RebabelWebpackPlugin;
