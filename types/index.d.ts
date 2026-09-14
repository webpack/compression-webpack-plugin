export = CompressionPlugin;
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
   * The key the compressed file is recorded under on the asset it came from,
   * which is how a dev server finds it and how an asset that already has one
   * is declined.
   * @private
   * @returns {string} the key
   */
  private relatedName;
  /**
   * What the compressed asset says about itself. It is another encoding of the
   * bytes rather than another version of the asset, so it inherits nothing the
   * original said — only its immutability, and only where the name it was
   * given still derives from the original's.
   * @private
   * @param {AssetInfo} info what the asset it was read from says
   * @returns {AssetInfo} what the compressed one says
   */
  private assetInfo;
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
