export = CompressionPlugin;
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
declare class CompressionPlugin<
  T = import("zlib").ZlibOptions,
> implements WebpackPluginInstance {
  /**
   * @param {(BasePluginOptions<T> & DefinedDefaultAlgorithmAndOptions<T>)=} options options
   */
  constructor(
    options?:
      | (BasePluginOptions<T> & DefinedDefaultAlgorithmAndOptions<T>)
      | undefined,
  );
  /**
   * @private
   * @type {InternalPluginOptions<T>}
   */
  private options;
  /**
   * @private
   * @type {AlgorithmFunction<T>}
   */
  private algorithm;
  /**
   * @private
   * @param {Buffer} input input
   * @returns {Promise<Buffer>} compressed buffer
   */
  private runCompressionAlgorithm;
  /**
   * @private
   * @param {Compiler} compiler compiler
   * @param {Compilation} compilation compilation
   * @param {Record<string, Source>} assets assets
   * @returns {Promise<void>}
   */
  private compress;
  /**
   * @param {Compiler} compiler compiler
   * @returns {void}
   */
  apply(compiler: Compiler): void;
}
declare namespace CompressionPlugin {
  export {
    Schema,
    AssetInfo,
    Compiler,
    PathData,
    WebpackPluginInstance,
    Compilation,
    Source,
    Asset,
    WebpackError,
    WithImplicitCoercion,
    Rule,
    Rules,
    EXPECTED_ANY,
    CustomOptions,
    InferDefaultType,
    CompressionOptions,
    AlgorithmFunction,
    Filename,
    DeleteOriginalAssets,
    BasePluginOptions,
    ZlibOptions,
    DefinedDefaultAlgorithmAndOptions,
    InternalPluginOptions,
  };
}
type Schema = import("schema-utils/declarations/validate").Schema;
type AssetInfo = import("webpack").AssetInfo;
type Compiler = import("webpack").Compiler;
type PathData = import("webpack").PathData;
type WebpackPluginInstance = import("webpack").WebpackPluginInstance;
type Compilation = import("webpack").Compilation;
type Source = import("webpack").sources.Source;
type Asset = import("webpack").Asset;
type WebpackError = import("webpack").WebpackError;
type WithImplicitCoercion<T> =
  | T
  | {
      valueOf(): T;
    };
type Rule = RegExp | string;
type Rules = Rule[] | Rule;
type EXPECTED_ANY = any;
type CustomOptions = {
  [key: string]: EXPECTED_ANY;
};
type InferDefaultType<T> = T extends infer U ? U : CustomOptions;
type CompressionOptions<T> = InferDefaultType<T>;
type AlgorithmFunction<T> = (
  input: Buffer,
  options: CompressionOptions<T>,
  callback: (
    error: Error | null | undefined,
    result:
      | WithImplicitCoercion<ArrayBuffer | SharedArrayBuffer>
      | Uint8Array
      | ReadonlyArray<number>
      | WithImplicitCoercion<Uint8Array | ReadonlyArray<number> | string>
      | WithImplicitCoercion<string>
      | {
          [Symbol.toPrimitive](hint: "string"): string;
        },
  ) => void,
) => any;
type Filename = string | ((fileData: PathData) => string);
type DeleteOriginalAssets =
  | boolean
  | "keep-source-map"
  | ((name: string) => boolean);
type BasePluginOptions<T> = {
  /**
   * include all assets that pass test assertion
   */
  test?: Rules | undefined;
  /**
   * include all assets matching any of these conditions
   */
  include?: Rules | undefined;
  /**
   * exclude all assets matching any of these conditions
   */
  exclude?: Rules | undefined;
  /**
   * only assets bigger than this size are processed, in bytes
   */
  threshold?: number | undefined;
  /**
   * only assets that compress better than this ratio are processed (`minRatio = Compressed Size / Original Size`)
   */
  minRatio?: number | undefined;
  /**
   * whether to delete the original assets or not
   */
  deleteOriginalAssets?: DeleteOriginalAssets | undefined;
  /**
   * the target asset filename
   */
  filename?: Filename | undefined;
};
type ZlibOptions = import("zlib").ZlibOptions;
type DefinedDefaultAlgorithmAndOptions<T> = T extends ZlibOptions
  ? {
      algorithm?: string | AlgorithmFunction<T> | undefined;
      compressionOptions?: CompressionOptions<T> | undefined;
    }
  : {
      algorithm: string | AlgorithmFunction<T>;
      compressionOptions?: CompressionOptions<T> | undefined;
    };
type InternalPluginOptions<T> = BasePluginOptions<T> & {
  algorithm: string | AlgorithmFunction<T>;
  compressionOptions: CompressionOptions<T>;
  threshold: number;
  minRatio: number;
  deleteOriginalAssets: DeleteOriginalAssets;
  filename: Filename;
};
