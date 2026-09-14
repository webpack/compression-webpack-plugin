/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/

const crypto = require("node:crypto");
const path = require("node:path");

const MinimizerPlugin = require("minimizer-webpack-plugin");
const { validate } = require("schema-utils");
const serialize = require("serialize-javascript");

const schema = require("./options.json");

/** @typedef {import("schema-utils/declarations/validate").Schema} Schema */
/** @typedef {import("webpack").AssetInfo} AssetInfo */
/** @typedef {import("webpack").Compiler} Compiler */
/** @typedef {import("webpack").PathData} PathData */
/** @typedef {import("webpack").WebpackPluginInstance} WebpackPluginInstance */
/** @typedef {import("webpack").Compilation} Compilation */
/** @typedef {import("webpack").sources.Source} Source */
/** @typedef {import("webpack").Asset} Asset */
/** @typedef {import("webpack").WebpackError} WebpackError */

/**
 * @template T
 * @typedef {T | { valueOf(): T }} WithImplicitCoercion
 */

/** @typedef {RegExp | string} Rule */
/** @typedef {Rule[] | Rule} Rules */

// eslint-disable-next-line jsdoc/reject-any-type
/** @typedef {any} EXPECTED_ANY */

/**
 * @typedef {{ [key: string]: EXPECTED_ANY }} CustomOptions
 */

/**
 * @template T
 * @typedef {T extends infer U ? U : CustomOptions} InferDefaultType
 */

/**
 * @template T
 * @typedef {InferDefaultType<T>} CompressionOptions
 */

/**
 * @template T
 * @callback AlgorithmFunction
 * @param {Buffer} input
 * @param {CompressionOptions<T>} options
 * @param {(error: Error | null | undefined, result: WithImplicitCoercion<ArrayBuffer | SharedArrayBuffer> | Uint8Array | ReadonlyArray<number> | WithImplicitCoercion<Uint8Array | ReadonlyArray<number> | string> | WithImplicitCoercion<string> | { [Symbol.toPrimitive](hint: 'string'): string }) => void} callback
 */

/**
 * @typedef {string | ((fileData: PathData) => string)} Filename
 */

/**
 * @typedef {boolean | "keep-source-map" | ((name: string) => boolean)} DeleteOriginalAssets
 */

/**
 * @template T
 * @typedef {object} BasePluginOptions
 * @property {Rules=} test include all assets that pass test assertion
 * @property {Rules=} include include all assets matching any of these conditions
 * @property {Rules=} exclude exclude all assets matching any of these conditions
 * @property {number=} threshold only assets bigger than this size are processed, in bytes
 * @property {number=} minRatio only assets that compress better than this ratio are processed (`minRatio = Compressed Size / Original Size`)
 * @property {DeleteOriginalAssets=} deleteOriginalAssets whether to delete the original assets or not
 * @property {Filename=} filename the target asset filename
 */

/**
 * @typedef {import("zlib").ZlibOptions} ZlibOptions
 */

/**
 * @template T
 * @typedef {T extends ZlibOptions ? { algorithm?: string | AlgorithmFunction<T> | undefined, compressionOptions?: CompressionOptions<T> | undefined } : { algorithm: string | AlgorithmFunction<T>, compressionOptions?: CompressionOptions<T> | undefined }} DefinedDefaultAlgorithmAndOptions
 */

/**
 * @template T
 * @typedef {BasePluginOptions<T> & { algorithm: string | AlgorithmFunction<T>, compressionOptions: CompressionOptions<T>, threshold: number, minRatio: number, deleteOriginalAssets: DeleteOriginalAssets, filename: Filename }} InternalPluginOptions
 */

const IMMUTABLE_NAME_REGEXP = /(\[name]|\[base]|\[file])/;

/**
 * Prepare compressed versions of assets to serve them with `Content-Encoding`.
 *
 * One `minimizer-webpack-plugin` asset generator does the work: compressing is
 * re-encoding an asset and writing the result beside it, which is what that
 * plugin's `generate` describes, so both halves of the common
 * minify-then-compress setup share one pass of filtering and one cache.
 * @template [T=ZlibOptions]
 * @implements WebpackPluginInstance
 */
class CompressionPlugin {
  /**
   * @param {(BasePluginOptions<T> & DefinedDefaultAlgorithmAndOptions<T>)=} options options
   */
  constructor(options) {
    validate(/** @type {Schema} */ (schema), options || {}, {
      name: "Compression Plugin",
      baseDataPath: "options",
    });

    const {
      test,
      include,
      exclude,
      algorithm = "gzip",
      compressionOptions = /** @type {CompressionOptions<T>} */ ({}),
      filename = (options || {}).algorithm === "brotliCompress"
        ? "[path][base].br"
        : "[path][base].gz",
      threshold = 0,
      minRatio = 0.8,
      deleteOriginalAssets = false,
    } = options || {};

    /**
     * @private
     * @type {InternalPluginOptions<T>}
     */
    this.options = {
      test,
      include,
      exclude,
      algorithm,
      compressionOptions,
      filename,
      threshold,
      minRatio,
      deleteOriginalAssets,
    };

    // Resolved here rather than at compress time so a name `zlib` does not have
    // is a configuration error, reported where the plugin was written.
    if (typeof algorithm === "string") {
      /**
       * @type {typeof import("zlib")}
       */
      const zlib = require("node:zlib");

      if (
        typeof zlib[/** @type {keyof typeof zlib} */ (algorithm)] !== "function"
      ) {
        throw new Error(`Algorithm "${algorithm}" is not found in "zlib"`);
      }
    }
  }

  /**
   * The key the compressed file is recorded under on the asset it came from,
   * which is how a dev server finds it and how an asset that already has one
   * is declined.
   * @private
   * @returns {string} the key
   */
  relatedName() {
    const { algorithm, filename } = this.options;

    if (typeof algorithm !== "function") {
      return algorithm === "gzip" ? "gzipped" : `${algorithm}ed`;
    }

    if (typeof filename === "function") {
      return `compression-function-${crypto
        .createHash("md5")
        .update(serialize(filename))
        .digest("hex")}`;
    }

    const queryIndex = filename.indexOf("?");
    const withoutQuery =
      queryIndex >= 0 ? filename.slice(0, queryIndex) : filename;

    return `${path.extname(withoutQuery).slice(1)}ed`;
  }

  /**
   * What the compressed asset says about itself. It is another encoding of the
   * bytes rather than another version of the asset, so it inherits nothing the
   * original said — only its immutability, and only where the name it was
   * given still derives from the original's.
   * @private
   * @param {AssetInfo} info what the asset it was read from says
   * @returns {AssetInfo} what the compressed one says
   */
  assetInfo(info) {
    const { filename } = this.options;
    /** @type {AssetInfo} */
    const compressed = { compressed: true };

    // TODO: possible problem when developer uses custom function, ideally we need to get parts of filename (i.e. name/base/ext/etc) in info
    // otherwise we can't detect an asset as immutable
    if (
      info.immutable &&
      typeof filename === "string" &&
      IMMUTABLE_NAME_REGEXP.test(filename)
    ) {
      compressed.immutable = true;
    }

    return compressed;
  }

  /**
   * @param {Compiler} compiler compiler
   * @returns {void}
   */
  apply(compiler) {
    const pluginName = this.constructor.name;
    const { test, include, exclude, algorithm, compressionOptions } =
      this.options;

    new MinimizerPlugin({
      test,
      include,
      exclude,
      // Nothing here minifies: the whole job is the generator below.
      minify: false,
      label: "Compression plugin",
      generate: {
        implementation: MinimizerPlugin.zlibCompress,
        options: { algorithm, compressionOptions },
        type: "asset",
        // Compressing reads the bytes a user downloads, so it runs after every
        // minimizer has had its say.
        stage:
          compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_TRANSFER,
        filename: this.options.filename,
        threshold: this.options.threshold,
        minRatio: this.options.minRatio,
        deleteOriginalAssets: this.options.deleteOriginalAssets,
        relatedName: this.relatedName(),
        assetInfo: (/** @type {AssetInfo} */ info) => this.assetInfo(info),
      },
    }).apply(compiler);

    compiler.hooks.compilation.tap(pluginName, (compilation) => {
      compilation.hooks.statsPrinter.tap(pluginName, (stats) => {
        stats.hooks.print
          .for("asset.info.compressed")
          .tap(
            "compression-webpack-plugin",
            (compressed, { green, formatFlag }) =>
              compressed
                ? /** @type {((value: string | number) => string)} */
                  (green)(
                    /** @type {(prefix: string) => string} */
                    (formatFlag)("compressed"),
                  )
                : "",
          );
      });
    });
  }
}

module.exports = CompressionPlugin;
