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

/**
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

    /**
     * @private
     * @type {AlgorithmFunction<T>}
     */
    this.algorithm =
      /** @type {AlgorithmFunction<T>} */
      (this.options.algorithm);

    if (typeof this.algorithm === "string") {
      /**
       * @type {typeof import("zlib")}
       */

      const zlib = require("node:zlib");

      /**
       * @private
       * @type {AlgorithmFunction<T>}
       */
      this.algorithm = zlib[this.algorithm];

      if (!this.algorithm) {
        throw new Error(
          `Algorithm "${this.options.algorithm}" is not found in "zlib"`,
        );
      }

      const defaultCompressionOptions =
        {
          gzip: {
            level: zlib.constants.Z_BEST_COMPRESSION,
          },
          deflate: {
            level: zlib.constants.Z_BEST_COMPRESSION,
          },
          deflateRaw: {
            level: zlib.constants.Z_BEST_COMPRESSION,
          },
          brotliCompress: {
            params: {
              [zlib.constants.BROTLI_PARAM_QUALITY]:
                zlib.constants.BROTLI_MAX_QUALITY,
            },
          },
        }[/** @type {string} */ (algorithm)] || {};

      this.options.compressionOptions =
        /**
         * @type {CompressionOptions<T>}
         */
        ({
          ...defaultCompressionOptions,
          .../** @type {CustomOptions} */ (this.options.compressionOptions),
        });
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
   * @param {Compiler} compiler compiler
   * @returns {void}
   */
  apply(compiler) {
    const {
      test,
      include,
      exclude,
      algorithm,
      compressionOptions,
      filename,
      threshold,
      minRatio,
      deleteOriginalAssets,
    } = this.options;

    // Reading an asset, writing one beside it, caching both and running them
    // where they belong is the same work whether the bytes come back smaller
    // or differently encoded, and `minimizer-webpack-plugin` already does it.
    // What stays here is what compression means by it.
    new MinimizerPlugin({
      // Every asset, where nothing said which: the `.js` default belongs to
      // minifying JavaScript, and compression is offered whatever is emitted.
      test: typeof test === "undefined" ? /[\s\S]/ : test,
      include,
      exclude,
      minify: {
        implementation: MinimizerPlugin.compress,
        options: { algorithm, compressionOptions },
        filename,
        threshold,
        minRatio,
        deleteOriginalAssets:
          typeof deleteOriginalAssets === "boolean"
            ? deleteOriginalAssets
            : undefined,
        relatedName: this.relatedName(),
      },
    }).apply(compiler);
  }
}

module.exports = CompressionPlugin;
