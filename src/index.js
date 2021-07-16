/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/

import path from "path";
import crypto from "crypto";

import { validate } from "schema-utils";
import serialize from "serialize-javascript";

import schema from "./options.json";

class CompressionPlugin {
  constructor(options = {}) {
    validate(schema, options, {
      name: "Compression Plugin",
      baseDataPath: "options",
    });

    const {
      test,
      include,
      exclude,
      algorithm = "gzip",
      compressionOptions = {},
      filename = "[path][base].gz",
      threshold = 0,
      minRatio = 0.8,
      deleteOriginalAssets = false,
    } = options;

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

    this.algorithm = this.options.algorithm;

    if (typeof this.algorithm === "string") {
      // eslint-disable-next-line global-require
      const zlib = require("zlib");

      this.algorithm = zlib[this.algorithm];

      if (!this.algorithm) {
        throw new Error(
          `Algorithm "${this.options.algorithm}" is not found in "zlib"`
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
        }[algorithm] || {};

      this.options.compressionOptions = {
        ...defaultCompressionOptions,
        ...this.options.compressionOptions,
      };
    }
  }

  runCompressionAlgorithm(input) {
    return new Promise((resolve, reject) => {
      this.algorithm(
        input,
        this.options.compressionOptions,
        (error, result) => {
          if (error) {
            return reject(error);
          }

          if (!Buffer.isBuffer(result)) {
            // eslint-disable-next-line no-param-reassign
            result = Buffer.from(result);
          }

          return resolve(result);
        }
      );
    });
  }

  async compress(compiler, compilation, assets) {
    const cache = compilation.getCache("CompressionWebpackPlugin");
    const assetsForMinify = (
      await Promise.all(
        Object.keys(assets).map(async (name) => {
          const { info, source } = compilation.getAsset(name);

          if (info.compressed) {
            return false;
          }

          if (
            !compiler.webpack.ModuleFilenameHelpers.matchObject.bind(
              // eslint-disable-next-line no-undefined
              undefined,
              this.options
            )(name)
          ) {
            return false;
          }

          let relatedName;

          if (typeof this.options.algorithm === "function") {
            if (typeof this.options.filename === "function") {
              relatedName = `compression-function-${crypto
                .createHash("md5")
                .update(serialize(this.options.filename))
                .digest("hex")}`;
            } else {
              let filenameForRelatedName = this.options.filename;

              const index = filenameForRelatedName.indexOf("?");

              if (index >= 0) {
                filenameForRelatedName = filenameForRelatedName.substr(
                  0,
                  index
                );
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
            cache.getLazyHashedEtag(source)
          );
          const output = (await cacheItem.getPromise()) || {};

          let buffer;

          // No need original buffer for cached files
          if (!output.source) {
            if (typeof source.buffer === "function") {
              buffer = source.buffer();
            }
            // Compatibility with webpack plugins which don't use `webpack-sources`
            // See https://github.com/webpack-contrib/compression-webpack-plugin/issues/236
            else {
              buffer = source.source();

              if (!Buffer.isBuffer(buffer)) {
                // eslint-disable-next-line no-param-reassign
                buffer = Buffer.from(buffer);
              }
            }

            if (buffer.length < this.options.threshold) {
              return false;
            }
          }

          return { name, source, info, buffer, output, cacheItem, relatedName };
        })
      )
    ).filter((assetForMinify) => Boolean(assetForMinify));

    const { RawSource } = compiler.webpack.sources;
    const scheduledTasks = [];

    for (const asset of assetsForMinify) {
      scheduledTasks.push(
        (async () => {
          const { name, source, buffer, output, cacheItem, info, relatedName } =
            asset;

          if (!output.source) {
            if (!output.compressed) {
              try {
                output.compressed = await this.runCompressionAlgorithm(buffer);
              } catch (error) {
                compilation.errors.push(error);

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

          const match = /^([^?#]*)(\?[^#]*)?(#.*)?$/.exec(name);
          const [, replacerFile] = match;
          const replacerQuery = match[2] || "";
          const replacerFragment = match[3] || "";
          const replacerExt = path.extname(replacerFile);
          const replacerBase = path.basename(replacerFile);
          const replacerName = replacerBase.slice(
            0,
            replacerBase.length - replacerExt.length
          );
          const replacerPath = replacerFile.slice(
            0,
            replacerFile.length - replacerBase.length
          );
          const pathData = {
            file: replacerFile,
            query: replacerQuery,
            fragment: replacerFragment,
            path: replacerPath,
            base: replacerBase,
            name: replacerName,
            ext: replacerExt || "",
          };

          let newFilename = this.options.filename;

          if (typeof newFilename === "function") {
            newFilename = newFilename(pathData);
          }

          const newName = newFilename.replace(
            /\[(file|query|fragment|path|base|name|ext)]/g,
            (p0, p1) => pathData[p1]
          );

          const newInfo = { compressed: true };

          if (info.immutable && /(\[name]|\[base]|\[file])/.test(newFilename)) {
            newInfo.immutable = true;
          }

          if (this.options.deleteOriginalAssets) {
            const needKeepSourceMap =
              this.options.deleteOriginalAssets === "keep-source-map";
            const isSameFilanem = name === newName;

            if (needKeepSourceMap || isSameFilanem) {
              const updatedAssetInfo = {};

              if (isSameFilanem) {
                updatedAssetInfo.related = null;
              } else {
                updatedAssetInfo.related = { sourceMap: null };
              }

              compilation.updateAsset(name, source, updatedAssetInfo);
            }

            compilation.deleteAsset(name);
          } else {
            compilation.updateAsset(name, source, {
              related: { [relatedName]: newName },
            });
          }

          compilation.emitAsset(newName, output.source, newInfo);
        })()
      );
    }

    return Promise.all(scheduledTasks);
  }

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
        (assets) => this.compress(compiler, compilation, assets)
      );

      compilation.hooks.statsPrinter.tap(pluginName, (stats) => {
        stats.hooks.print
          .for("asset.info.compressed")
          .tap(
            "compression-webpack-plugin",
            (compressed, { green, formatFlag }) =>
              // eslint-disable-next-line no-undefined
              compressed ? green(formatFlag("compressed")) : undefined
          );
      });
    });
  }
}

export default CompressionPlugin;
