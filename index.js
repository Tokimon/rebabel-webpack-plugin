import { transform } from 'babel-core';
import { SourceMapSource, RawSource } from 'webpack-sources';

function addPrefixToFile(prefix, file) {
  return file.replace(/(^|[/\\])([^/\\]+)$/, `$1${prefix}$2`);
}

class RebabelWebpackPlugin {
  constructor({ babel: babelConfig = {}, prefix = 'es5-', createChunk = false } = {}) {
    this.options = {
      babel: Object.assign({ sourceType: 'script' }, babelConfig),
      prefix,
      createChunk
    };
  }

  apply(compiler) {
    const { babel: babelConfig, prefix, createChunk } = this.options;

    if(typeof babelConfig.sourceMaps === 'undefined') {
      babelConfig.sourceMaps = !!compiler.options.devtool;
    }

    compiler.plugin('compilation', (compilation) => {
      compilation.plugin('additional-assets', function(cb) {
        const { assets, chunks, additionalChunkAssets } = compilation;

        const isValidFile = (file) => !!assets[file] && /\.js($|\?)/i.test(file);
        const mapFile = (file) => isValidFile(file) ? addPrefixToFile(prefix, file) : file;

        // Find all asset files
        const chunkCopies = [];
        const files = chunks.reduce((arr, chunk) => {
          if(!chunk.rendered) { return arr; }

          if(createChunk) {
            // Create chunk copy
            const copy = Object.assign(Object.create(chunk), {
              name: chunk.name ? `${prefix}${chunk.name}` : chunk.name,
              files: (chunk.files || []).map(mapFile),
              parents: chunk.parents.map(
                (parent) => Object.assign({}, parent, { files: (parent.files || []).map(mapFile) })
              )
            });

            chunkCopies.push(copy);
          }

          // Add current files to the list of files
          return arr.concat(chunk.files.filter(isValidFile));
        }, []);

        const validAdditionalChunkAssets = additionalChunkAssets.filter(isValidFile);

        files.push(...validAdditionalChunkAssets);

        // Add chunk copies
        chunks.push(...chunkCopies);

        // Update any additional chunk assets
        additionalChunkAssets.push(
          ...validAdditionalChunkAssets
            .map((file) => addPrefixToFile(prefix, file))
        );

        const transpiles = files
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

              const es5File = addPrefixToFile(prefix, file);
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
    });
  }
}

export { RebabelWebpackPlugin };
export default RebabelWebpackPlugin;
