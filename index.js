import { transform } from 'babel-core';
import { SourceMapSource, RawSource } from 'webpack-sources';

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

      // Find all asset files
      const files = chunks.reduce((arr, chunk) => (chunk.rendered ? arr.concat(chunk.files) : arr), []);
      files.push(...additionalChunkAssets);

      const transpiles = files
        // Only include .js files that exist in the asset collection
        .filter((file) => !!assets[file] && /\.js($|\?)/i.test(file))
        // Do async transform for each file, to avoid to many blocking calls
        .map((file) => new Promise((resolve, reject) => {
          try {
            const asset = assets[file];
            let source = {
              source: asset.source(),
              map: babelConfig.sourceMaps ? asset.map() : null
            };

            // Use `sourceAndMap` if sourceMpas are needed
            if(babelConfig.sourceMaps && asset.sourceAndMap) {
              source = asset.sourceAndMap();
            }

            const es5File = `${prefix}${file}`;
            let { code, map } = transform(asset.source(), babelConfig);

            // Insert prefix into the async chunk call
            code = code.replace(/\b(script|\w).src\s*=\s*(__webpack_require__|\w).p\s*\+\s*["']/, `$&${prefix}`);

            // Save transpiled code under the new file name
            assets[es5File] = map
              ? new SourceMapSource(code, file, map, source.source, source.map)
              : new RawSource(code);

            // Resolve what ever
            resolve(es5File);
          } catch(err) { reject(err); }
        }));

      // Run all transpiles
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

export { RebabelWebpackPlugin };
export default RebabelWebpackPlugin;
