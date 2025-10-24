<div align="center">
  <a href="https://github.com/webpack/webpack">
    <img width="200" height="200" src="https://webpack.js.org/assets/icon-square-big.svg">
  </a>
</div>

[![npm][npm]][npm-url]
[![node][node]][node-url]
[![tests][tests]][tests-url]
[![cover][cover]][cover-url]
[![discussion][discussion]][discussion-url]
[![size][size]][size-url]

# compression-webpack-plugin

Prepare compressed versions of assets to serve them with Content-Encoding.

## Getting Started

To begin, you'll need to install `compression-webpack-plugin`:

```console
npm install compression-webpack-plugin --save-dev
```

or

```console
yarn add -D compression-webpack-plugin
```

or

```console
pnpm add -D compression-webpack-plugin
```

Then add the plugin to your `webpack` config. For example:

**webpack.config.js**

```js
const CompressionPlugin = require("compression-webpack-plugin");

module.exports = {
  plugins: [new CompressionPlugin()],
};
```

Finally, run `webpack` using the method you normally use (e.g., via CLI or an npm script).

## Options

- **[`test`](#test)**
- **[`include`](#include)**
- **[`exclude`](#exclude)**
- **[`algorithm`](#algorithm)**
- **[`compressionOptions`](#compressionoptions)**
- **[`threshold`](#threshold)**
- **[`minRatio`](#minratio)**
- **[`filename`](#filename)**
- **[`deleteOriginalAssets`](#deleteoriginalassets)**

### `test`

Type:

```ts
type test = string | RegExp | (string | RegExp)[];
```

Default: `undefined`

Include all assets that pass test assertion.

**webpack.config.js**

```js
module.exports = {
  plugins: [
    new CompressionPlugin({
      test: /\.js(\?.*)?$/i,
    }),
  ],
};
```

### `include`

Type:

```ts
type include = string | RegExp | (string | RegExp)[];
```

Default: `undefined`

Include all assets matching any of these conditions.

**webpack.config.js**

```js
module.exports = {
  plugins: [
    new CompressionPlugin({
      include: /\/includes/,
    }),
  ],
};
```

### `exclude`

Type:

```ts
type exclude = string | RegExp | (string | RegExp)[];
```

Default: `undefined`

Exclude all assets matching any of these conditions.

**webpack.config.js**

```js
module.exports = {
  plugins: [
    new CompressionPlugin({
      exclude: /\/excludes/,
    }),
  ],
};
```

### `algorithm`

Type:

```ts
type algorithm =
  | string
  | ((
      input: Buffer,
      options: CompressionOptions,
      callback: (
        error: Error | null | undefined,
        result:
          | string
          | ArrayBuffer
          | SharedArrayBuffer
          | Uint8Array
          | readonly number[]
          | {
              valueOf(): ArrayBuffer | SharedArrayBuffer;
            }
          | {
              valueOf(): string | Uint8Array | readonly number[];
            }
          | {
              valueOf(): string;
            }
          | {
              [Symbol.toPrimitive](hint: "string"): string;
            },
      ) => void,
    ) => void);
```

Defines the compression algorithm or function to use. Defaults to `gzip`.

> [!NOTE]
>
> If you use a custom function for the `algorithm` option, the default value of `compressionOptions` will be an empty object `{}`.

#### `string`

The algorithm is based on the Node.js [zlib](https://nodejs.org/api/zlib.html) module.

**webpack.config.js**

```js
module.exports = {
  plugins: [
    new CompressionPlugin({
      algorithm: "gzip",
    }),
  ],
};
```

#### `function`

Allow you to specify a custom compression function.

**webpack.config.js**

```js
module.exports = {
  plugins: [
    new CompressionPlugin({
      algorithm(input, compressionOptions, callback) {
        return compressionFunction(input, compressionOptions, callback);
      },
    }),
  ],
};
```

### `compressionOptions`

Type:

```ts
interface compressionOptions {
  flush?: number;
  finishFlush?: number;
  chunkSize?: number;
  windowBits?: number;
  level?: number;
  memLevel?: number;
  strategy?: number;
  dictionary?: Buffer | TypedArray | DataView | ArrayBuffer;
  info?: boolean;
  maxOutputLength?: number;
}
```

Default: `{ level: 9 }`

Compression options for `algorithm`.

You can find all available options in the [zlib](https://nodejs.org/api/zlib.html#zlib_class_options) documentation.

> [!NOTE]
>
> If you use a custom function for the `algorithm` option, the default value of `compressionOptions` will be an empty object `{}`.

**webpack.config.js**

```js
module.exports = {
  plugins: [
    new CompressionPlugin({
      compressionOptions: { level: 1 },
    }),
  ],
};
```

### `threshold`

Type:

```ts
type threshold = number;
```

Default: `0`

Only assets larger than this size (in bytes) are processed.

**webpack.config.js**

```js
module.exports = {
  plugins: [
    new CompressionPlugin({
      threshold: 8192,
    }),
  ],
};
```

### `minRatio`

Type:

```ts
type minRatio = number;
```

Default: `0.8`

Only assets that compress better than this ratio are processed (`minRatio = Compressed Size / Original Size`).
For example, if you have a `image.png` file with a size of 1024 bytes, and its compressed version is of 768 bytes, the `minRatio` is `0.75`.
In other words, assets will be processed only when the ratio of `Compressed Size / Original Size` is less than the specified `minRatio`.

You can use a value of `1` to process assets that are smaller than or equal to the original size.

Use a value of `Infinity` to process all assets, even if they are larger than the original size or their original size is `0` bytes (useful when you are pre-zipping all assets for AWS).

Use a value of `Number.MAX_SAFE_INTEGER` to process all assets even if they are larger than the original size, excluding assets with their original size is `0` bytes.

**webpack.config.js**

```js
module.exports = {
  plugins: [
    new CompressionPlugin({
      // Compress all assets, including files with `0` bytes size
      // minRatio: Infinity

      // Compress all assets, excluding files with `0` bytes size
      // minRatio: Number.MAX_SAFE_INTEGER

      minRatio: 0.8,
    }),
  ],
};
```

### `filename`

Type:

```ts
type filename = string | ((pathdata: PathData) => string);
```

Default: `"[path][base].gz"`

The target asset filename.

#### `string`

For example, given an asset path: `assets/images/image.png?foo=bar#hash`:

`[path]` is replaced with the directories of the original asset, including the trailing `/` (`assets/images/`).

`[file]` is replaced with the path of the original asset (`assets/images/image.png`).

`[base]` is replaced with the base name (`[name]` + `[ext]`) of the original asset (`image.png`).

`[name]` is replaced with the name of the original asset (`image`).

`[ext]` is replaced with the extension of the original asset, including the `.` (`.png`).

`[query]` is replaced with the query of the original asset, including the `?` (`?foo=bar`).

`[fragment]` is replaced with the fragment (in the concept of URL it is called `hash`) of the original asset (`#hash`).

**webpack.config.js**

```js
module.exports = {
  plugins: [
    new CompressionPlugin({
      filename: "[path][base].gz",
    }),
  ],
};
```

#### `function`

**webpack.config.js**

```js
module.exports = {
  plugins: [
    new CompressionPlugin({
      filename(pathData) {
        // The `pathData` argument contains all placeholders - `path`/`name`/`ext`/etc
        // Available properties described above, for the `String` notation
        if (/\.svg$/.test(pathData.filename)) {
          return "assets/svg/[path][base].gz";
        }

        return "assets/js/[path][base].gz";
      },
    }),
  ],
};
```

### `deleteOriginalAssets`

Type:

```ts
type deleteOriginalAssets =
  | boolean
  | "keep-source-map"
  | ((name: string) => boolean);
```

Default: `false`

Determines whether the original (uncompressed) assets should be deleted after compression.

- If set to `true` , all original assets will be deleted.

- If set to `"keep-source-map"`, all original assets except source maps (`.map` files) will be deleted.

- If a function is provided, it will be called with each asset’s name and should return `true` to delete the asset or `false` to keep it.

Example:

```js
module.exports = {
  plugins: [
    new CompressionPlugin({
      deleteOriginalAssets: (assetName) =>
        // Delete all assets except images
        !assetName.endsWith(".png") && !assetName.endsWith(".jpg"),
    }),
  ],
};
```

**webpack.config.js**

```js
module.exports = {
  plugins: [
    new CompressionPlugin({
      deleteOriginalAssets: true,
    }),
  ],
};
```

To exclude sourcemaps from compression:

```js
module.exports = {
  plugins: [
    new CompressionPlugin({
      exclude: /.map$/,
      deleteOriginalAssets: "keep-source-map",
    }),
  ],
};
```

Using a custom function:

```js
module.exports = {
  plugins: [
    new CompressionPlugin({
      exclude: /.map$/,
      deleteOriginalAssets: (name) => {
        if (/\.js$/.test(name)) {
          return false;
        }

        return true;
      },
    }),
  ],
};
```

## Examples

### Using Zopfli

Prepare compressed versions of assets using the `zopfli` library.

> [!NOTE]
>
> `@gfx/zopfli` requires at least `Node.js` version `8`.

To begin, you'll need to install `@gfx/zopfli`:

```console
$ npm install @gfx/zopfli --save-dev
```

**webpack.config.js**

```js
const zopfli = require("@gfx/zopfli");

module.exports = {
  plugins: [
    new CompressionPlugin({
      compressionOptions: {
        numiterations: 15,
      },
      algorithm(input, compressionOptions, callback) {
        return zopfli.gzip(input, compressionOptions, callback);
      },
    }),
  ],
};
```

### Using Brotli

[Brotli](https://en.wikipedia.org/wiki/Brotli) is a compression algorithm originally developed by Google, and offers compression superior to gzip.

Node.js v10.16.0 and later includes [native support](https://nodejs.org/api/zlib.html#zlib_zlib_createbrotlicompress_options) for Brotli compression in its `zlib` module.

You can take advantage of this built-in support for Brotli in Node 10.16.0 and later by just passing in the appropriate `algorithm` to the CompressionPlugin:

**webpack.config.js**

```js
const zlib = require("node:zlib");

module.exports = {
  plugins: [
    new CompressionPlugin({
      filename: "[path][base].br",
      algorithm: "brotliCompress",
      test: /\.(js|css|html|svg)$/,
      compressionOptions: {
        params: {
          [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
        },
      },
      threshold: 10240,
      minRatio: 0.8,
      deleteOriginalAssets: false,
    }),
  ],
};
```

[!NOTE] Brotli’s `BROTLI_PARAM_QUALITY` option is functionally equivalent to zlib’s `level` option.
You can find all Brotli’s options in [the relevant part of the zlib module documentation](https://nodejs.org/api/zlib.html#zlib_class_brotlioptions).

### Using Zstandard

[Zstandard](https://facebook.github.io/zstd/) (zstd) is a fast lossless compression algorithm, targeting real-time compression scenarios at zlib-level and better compression ratios.

Node.js 22.15.0 and later includes [native support](https://nodejs.org/api/zlib.html#zlibcreatezstdcompressoptions) for Zstandard compression in its `zlib` module.

You can take advantage of this built-in support for zstd in Node 22.15.0 and later by just passing in the appropriate `algorithm` to the CompressionPlugin:

**webpack.config.js**

```js
const zlib = require("node:zlib");

module.exports = {
  plugins: [
    new CompressionPlugin({
      filename: "[path][base].zst",
      algorithm: "zstdCompress",
      test: /\.(js|css|html|svg)$/,
      compressionOptions: {
        params: {
          [zlib.constants.ZSTD_c_compressionLevel]: 10,
        },
      },
      threshold: 10240,
      minRatio: 0.8,
      deleteOriginalAssets: false,
    }),
  ],
};
```

You can find all Zstandard's options in [the relevant part of the zlib module documentation](https://nodejs.org/api/zlib.html#class-zstdoptions).

### Multiple compressed versions of assets for different algorithm

**webpack.config.js**

```js
const zlib = require("node:zlib");

module.exports = {
  plugins: [
    new CompressionPlugin({
      filename: "[path][base].gz",
      algorithm: "gzip",
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0.8,
    }),
    new CompressionPlugin({
      filename: "[path][base].br",
      algorithm: "brotliCompress",
      test: /\.(js|css|html|svg)$/,
      compressionOptions: {
        params: {
          [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
        },
      },
      threshold: 10240,
      minRatio: 0.8,
    }),
  ],
};
```

## Contributing

We welcome contributions!

Please take a moment to read our contributing guidelines if you haven't yet done so.

[CONTRIBUTING](./.github/CONTRIBUTING.md)

## License

[MIT](./LICENSE)

[npm]: https://img.shields.io/npm/v/compression-webpack-plugin.svg
[npm-url]: https://npmjs.com/package/compression-webpack-plugin
[node]: https://img.shields.io/node/v/compression-webpack-plugin.svg
[node-url]: https://nodejs.org
[tests]: https://github.com/webpack/compression-webpack-plugin/workflows/compression-webpack-plugin/badge.svg
[tests-url]: https://github.com/webpack/compression-webpack-plugin/actions
[cover]: https://codecov.io/gh/webpack/compression-webpack-plugin/branch/main/graph/badge.svg
[cover-url]: https://codecov.io/gh/webpack/compression-webpack-plugin
[discussion]: https://img.shields.io/github/discussions/webpack/webpack
[discussion-url]: https://github.com/webpack/webpack/discussions
[size]: https://packagephobia.now.sh/badge?p=compression-webpack-plugin
[size-url]: https://packagephobia.now.sh/result?p=compression-webpack-plugin
