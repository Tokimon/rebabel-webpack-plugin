# Rebabel Webpack Plugin

A webpack plugin that let you re-transpile asset JS files with babel and save to another file.

## But why?

Today the norm today is to transpile all your beautiful ES6/7 code into ES 3/5, so that
your script work across all browsers and be done with it, however that is quite a waste
of time and resources, as many modern browsers already support ALOT of the new features
(including IE Edge). A better alternative is to serve the "good" ES 6/7 version of your
code to those browsers that supports this and serve the transpiled version to browsers
that don't. This minimizes file size overhead and make use of the performance benefits
there are in the ES 6/7 version and generally makes your app leaner.

This all very good but it is not directly evident how you create two versions of the exact
same code in your bundle with the way Webpack work today.  
One solution is to run two simultaneous builds with same entry files but
with different Babel setups and you are good to go. This works fine but it increases your
build time by a factor of 2 (or more) as you have to run the exact same build twice,
which includes transforming asset paths, processing images, compiling css, etc. etc..
All just to have the exact same JS code targeting different ES versions.

This is why I created this Plugin. It takes the compiled code files and runs it through the babel
transpiler one more time (hence the name), saves the new code to a new file and update
the dynamic chunk reference to this new file.

*Result:* Multiple versions of the same code but with different ES targets.

## Usage

Include in your `webpack.config.js`:

```js
// CJS
const RebabelPlugin = require('rebabel-webpack-plugin');

// ES modules
import RebabelPlugin from 'rebabel-webpack-plugin';
```

Add the plugin to your list of plugins:

```js
// In your Webpack setup
{
  // ... other settings ...
  plugins: [
    new RebabelPlugin({ /* options */  })
    // ... Repeat for several versions - eg. ES 7 to ES 6 ...
  ]
}

// ES 5 transpilation example:
{
  // ... other settings ...
  plugins: [
    new RebabelPlugin({
      babel: { presets: ['es2015'] },
      prefix: 'degrated-'
    })
  ]
}
```

Thats it!

### Worth noting

As the ReBabal runs after the initial files have been transpiled the first time,
there is no need to indicate the same plugins for the ReBabel babel configuration.
You only need to add the subsequent transpilation presets/plugins.

## Options

- **babel**: [The babel setup](https://babeljs.io/docs/usage/api/#options) transferred directly to the `babel.transform` call.
- **prefix**: The prefix to append to the each asset file name (default: `es5-`).
- **createChunk**: Should the re-transpiled assets be exposed as chunks as well.

## Caveats

- As it is right now, you have to pass the `minified` to the `babel` options if you
are minifying the files, as I have found no reliable way to detect if the file is intentionally minified.

- To expose the re-transpiled components to the `stats` (used by plugins like [webpack-bundle-analyzer](https://github.com/th0r/webpack-bundle-analyzer) or [assets-webpack-plugin](https://github.com/kossnocorp/assets-webpack-plugin)) the corresponding chunk needs to be created, which is enabled by `createChunk` option.

## Known issues

- If you want the re-transpiled assets to appear in [webpack-bundle-analyzer](https://github.com/th0r/webpack-bundle-analyzer)
you need to set `createChunk = true`. However if you want to transpile to es5,
unfortunately you cannot use the [babel-preset-es2015](https://babeljs.io/docs/plugins/preset-es2015/)
as it includes [babel-plugin-transform-es2015-function-name](https://babeljs.io/docs/plugins/transform-es2015-function-name/)
that messes up the parser in `webpack-bundle-analyzer`, because it renames anonymous functions created by webpack to `_()`.  
The work around is to include all the transform plugins provided by the `babel-preset-es2015` except `transform-es2015-function-name`.
