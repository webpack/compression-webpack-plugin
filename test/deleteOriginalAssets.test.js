import CompressionPlugin from "../src/index";

import {
  compile,
  getAssetsNameAndSize,
  getCompiler,
  getErrors,
  getWarnings,
} from "./helpers/index";

describe('"deleteOriginalAssets" option', () => {
  let compiler;

  beforeEach(() => {
    compiler = getCompiler("./entry.js");
  });

  it("should work and keep original assets by default", async () => {
    compiler = getCompiler("./entry.js");

    new CompressionPlugin().apply(compiler);

    const stats = await compile(compiler);

    expect(getAssetsNameAndSize(stats, compiler)).toMatchSnapshot("assets");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
    expect(getErrors(stats)).toMatchSnapshot("errors");
  });

  it("should work and keep original assets", async () => {
    new CompressionPlugin({
      minRatio: 1,
      deleteOriginalAssets: false,
    }).apply(compiler);

    const stats = await compile(compiler);

    expect(getAssetsNameAndSize(stats, compiler)).toMatchSnapshot("assets");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
    expect(getErrors(stats)).toMatchSnapshot("errors");
  });

  it("should work and delete original assets", async () => {
    new CompressionPlugin({
      minRatio: 1,
      deleteOriginalAssets: true,
    }).apply(compiler);

    const stats = await compile(compiler);

    expect(getAssetsNameAndSize(stats, compiler)).toMatchSnapshot("assets");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
    expect(getErrors(stats)).toMatchSnapshot("errors");
  });

  it("should work and delete original assets when function used", async () => {
    new CompressionPlugin({
      minRatio: 1,
      deleteOriginalAssets: (name) => {
        if (/\.js$/.test(name)) {
          return true;
        }

        return false;
      },
    }).apply(compiler);

    const stats = await compile(compiler);

    expect(getAssetsNameAndSize(stats, compiler)).toMatchSnapshot("assets");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
    expect(getErrors(stats)).toMatchSnapshot("errors");
  });

  it("should work and write over the original where the filename is its own", async () => {
    compiler = getCompiler("./entry.js");

    new CompressionPlugin({
      filename: "[path][base]",
    }).apply(compiler);

    const stats = await compile(compiler);

    expect(getAssetsNameAndSize(stats, compiler)).toMatchSnapshot("assets");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
    expect(getErrors(stats)).toMatchSnapshot("errors");
  });

  it("should work and do not report errors on duplicate assets when original assets were removed", async () => {
    compiler = getCompiler("./entry.js");

    new CompressionPlugin({
      filename: "[path][base]",
      deleteOriginalAssets: true,
    }).apply(compiler);

    const stats = await compile(compiler);

    expect(getAssetsNameAndSize(stats, compiler)).toMatchSnapshot("assets");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
    expect(getErrors(stats)).toMatchSnapshot("errors");
  });

  it("should keep what a second instance wrote beside the deleted asset", async () => {
    compiler = getCompiler("./entry.js");

    new CompressionPlugin({
      algorithm: "brotliCompress",
      filename: "[path][base].br",
    }).apply(compiler);
    new CompressionPlugin({
      algorithm: "gzip",
      filename: "[path][base].gz",
      deleteOriginalAssets: true,
    }).apply(compiler);

    const stats = await compile(compiler);
    const names = Object.keys(stats.compilation.assets);

    // Deleting an asset takes everything its `related` names with it, so the
    // one deleting second must not take the first one's file too.
    const brotli = names.filter((name) => name.endsWith(".br"));
    const gzipped = names.filter((name) => name.endsWith(".gz"));

    expect(brotli.length).toBeGreaterThan(0);
    expect(gzipped).toHaveLength(brotli.length);
    // Or nothing deleting anything would satisfy the two above.
    expect(names.some((name) => name.endsWith(".js"))).toBe(false);
    expect(getErrors(stats)).toEqual([]);
    expect(getWarnings(stats)).toEqual([]);
  });

  it('should delete original assets and keep source maps with option "keep-source-map"', async () => {
    compiler = getCompiler(
      "./entry.js",
      {},
      {
        devtool: "source-map",
      },
    );

    new CompressionPlugin({
      filename: "[path][base]",
      exclude: /\.map$/,
      deleteOriginalAssets: "keep-source-map",
    }).apply(compiler);

    const stats = await compile(compiler);

    expect(getAssetsNameAndSize(stats, compiler)).toMatchSnapshot("assets");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
    expect(getErrors(stats)).toMatchSnapshot("errors");
  });
});
