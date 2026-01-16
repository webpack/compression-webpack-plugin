// eslint-disable-next-line jsdoc/no-restricted-syntax
/** @typedef {any} EXPECTED_ANY */

/**
 * @typedef {{ [key: string]: EXPECTED_ANY }} CustomOptions
 */

/**
 * @typedef {object} CompressOptions
 * @property {string} inputBase64 input buffer as base64 string
 * @property {string} algorithm algorithm name
 * @property {CustomOptions} compressionOptions compression options
 */

/**
 * @typedef {object} CompressResult
 * @property {string} compressedBase64 compressed buffer as base64 string
 */

/**
 * @param {CompressOptions} options compress options
 * @returns {Promise<CompressResult>} compressed result
 */
async function compress(options) {
  const { inputBase64, algorithm, compressionOptions } = options;

  /**
   * @type {typeof import("node:zlib")}
   */
  const zlib = require("node:zlib");

  const input = Buffer.from(inputBase64, "base64");

  return new Promise((resolve, reject) => {
    /**
     * @type {((buf: Buffer, options: CustomOptions, callback: (error: Error | null, result: Buffer) => void) => void)}
     */
    const zlibFunction =
      zlib[
        /** @type {"gzip" | "deflate" | "deflateRaw" | "brotliCompress"} */ (
          algorithm
        )
      ];

    zlibFunction(
      input,
      compressionOptions,
      /**
       * @param {Error | null} error error from zlib
       * @param {Buffer} result compressed buffer
       */
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        const compressed = Buffer.isBuffer(result)
          ? result
          : Buffer.from(/** @type {string} */ (result));

        resolve({ compressedBase64: compressed.toString("base64") });
      },
    );
  });
}

module.exports = { compress };
