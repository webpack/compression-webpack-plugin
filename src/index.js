/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/

const crypto = require("node:crypto");
const path = require("node:path");

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

// eslint-disable-next-line jsdoc/no-restricted-syntax
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
   * @private
   * @param {Buffer} input input
   * @returns {Promise<Buffer>} compressed buffer
   */
  runCompressionAlgorithm(input) {
    return new Promise((resolve, reject) => {
      this.algorithm(
        input,
        this.options.compressionOptions,
        (error, result) => {
          if (error) {
            reject(error);

            return;
          }

          if (!Buffer.isBuffer(result)) {
            resolve(Buffer.from(/** @type {string} */ (result)));
          } else {
            resolve(result);
          }
        },
      );
    });
  }

  /**
   * @private
   * @param {Compiler} compiler compiler
   * @param {Compilation} compilation compilation
   * @param {Record<string, Source>} assets assets
   * @returns {Promise<void>}
   */
  async compress(compiler, compilation, assets) {
    const cache = compilation.getCache("CompressionWebpackPlugin");

    /**
     * @typedef {object} AssetForCompression
     * @property {string} name name
     * @property {Source} source source
     * @property {{ source: Source, compressed: Buffer }} output output
     * @property {AssetInfo} info asset info
     * @property {Buffer} buffer buffer
     * @property {ReturnType<ReturnType<Compilation["getCache"]>["getItemCache"]>} cacheItem cache item
     * @property {string} relatedName related name
     */

    const assetsForCompression = (
      await Promise.all(
        Object.keys(assets).map(async (name) => {
          const { info, source } =
            /** @type {Asset} */
            (compilation.getAsset(name));

          if (info.compressed) {
            return false;
          }

          if (
            !compiler.webpack.ModuleFilenameHelpers.matchObject.bind(
              undefined,
              this.options,
            )(name)
          ) {
            return false;
          }

          /**
           * @type {string | undefined}
           */
          let relatedName;

          if (typeof this.options.algorithm === "function") {
            if (typeof this.options.filename === "function") {
              relatedName = `compression-function-${crypto
                .createHash("md5")
                .update(serialize(this.options.filename))
                .digest("hex")}`;
            } else {
              /**
               * @type {string}
               */
              let filenameForRelatedName = this.options.filename;

              const index = filenameForRelatedName.indexOf("?");

              if (index >= 0) {
                filenameForRelatedName = filenameForRelatedName.slice(0, index);
              }

              relatedName = `${path
                .extname(filenameForRelatedName)
                .slice(1)}ed`;
            }
          } else if (this.options.algorithm === "gzip") {
            relatedName = "gzipped";
          } else {
            relatedName = `${this.options.algorithm}ed`;
          }

          if (info.related && info.related[relatedName]) {
            return false;
          }

          const cacheItem = cache.getItemCache(
            serialize({
              name,
              algorithm: this.options.algorithm,
              compressionOptions: this.options.compressionOptions,
            }),
            cache.getLazyHashedEtag(source),
          );
          const output = (await cacheItem.getPromise()) || {};

          let buffer;

          // No need original buffer for cached files
          if (!output.source) {
            if (typeof source.buffer === "function") {
              buffer = source.buffer();
            }
            // Compatibility with webpack plugins which don't use `webpack-sources`
            // See https://github.com/webpack/compression-webpack-plugin/issues/236
            else {
              buffer = source.source();

              if (!Buffer.isBuffer(buffer)) {
                buffer = Buffer.from(buffer);
              }
            }

            if (buffer.length < this.options.threshold) {
              return false;
            }
          }

          return { name, source, info, buffer, output, cacheItem, relatedName };
        }),
      )
    ).filter(Boolean);

    const { RawSource } = compiler.webpack.sources;
    const scheduledTasks = [];

    for (const asset of assetsForCompression) {
      scheduledTasks.push(
        (async () => {
          const { name, source, buffer, output, cacheItem, info, relatedName } =
            /** @type {AssetForCompression} */
            (asset);

          if (!output.source) {
            if (!output.compressed) {
              try {
                output.compressed = await this.runCompressionAlgorithm(buffer);
              } catch (error) {
                compilation.errors.push(/** @type {WebpackError} */ (error));

                return;
              }
            }

            if (
              output.compressed.length / buffer.length >
              this.options.minRatio
            ) {
              await cacheItem.storePromise({ compressed: output.compressed });

              return;
            }

            output.source = new RawSource(output.compressed);

            await cacheItem.storePromise(output);
          }

          const newFilename = compilation.getPath(this.options.filename, {
            filename: name,
          });
          /** @type {AssetInfo} */
          const newInfo = { compressed: true };

          // TODO: possible problem when developer uses custom function, ideally we need to get parts of filename (i.e. name/base/ext/etc) in info
          // otherwise we can't detect an asset as immutable
          if (
            info.immutable &&
            typeof this.options.filename === "string" &&
            /(\[name]|\[base]|\[file])/.test(this.options.filename)
          ) {
            newInfo.immutable = true;
          }

          if (this.options.deleteOriginalAssets) {
            if (this.options.deleteOriginalAssets === "keep-source-map") {
              compilation.updateAsset(name, source, {
                related: { sourceMap: null },
              });

              compilation.deleteAsset(name);
            } else if (
              typeof this.options.deleteOriginalAssets === "function"
            ) {
              if (this.options.deleteOriginalAssets(name)) {
                compilation.deleteAsset(name);
              }
            } else {
              compilation.deleteAsset(name);
            }
          } else {
            compilation.updateAsset(name, source, {
              related: { [relatedName]: newFilename },
            });
          }

          compilation.emitAsset(newFilename, output.source, newInfo);
        })(),
      );
    }

    await Promise.all(scheduledTasks);
  }

  /**
   * @param {Compiler} compiler compiler
   * @returns {void}
   */
  apply(compiler) {
    const pluginName = this.constructor.name;

    compiler.hooks.thisCompilation.tap(pluginName, (compilation) => {
      compilation.hooks.processAssets.tapPromise(
        {
          name: pluginName,
          stage:
            compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_TRANSFER,
          additionalAssets: true,
        },
        (assets) => this.compress(compiler, compilation, assets),
      );

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
