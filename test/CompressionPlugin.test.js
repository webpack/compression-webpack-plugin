import zlib from "zlib";
import path from "path";

import { GenerateSW, InjectManifest } from "workbox-webpack-plugin";
import { StatsWriterPlugin } from "webpack-stats-plugin";

import CompressionPlugin from "../src/index";

import {
  compile,
  CopyPluginWithAssetInfo,
  ModifyExistingAsset,
  EmitNewAsset,
  getAssetsNameAndSize,
  getCompiler,
  getErrors,
  getWarnings,
} from "./helpers/index";

describe("CompressionPlugin", () => {
  it("should work", async () => {
    const compiler = getCompiler(
      "./entry.js",
      {},
      {
        output: {
          path: `${__dirname}/dist`,
          filename: "[name].js?var=[hash]",
          chunkFilename: "[id].[name].js?ver=[hash]",
        },
      }
    );

    new CompressionPlugin().apply(compiler);

    const stats = await compile(compiler);

    expect(getAssetsNameAndSize(stats, compiler)).toMatchSnapshot("assets");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
    expect(getErrors(stats)).toMatchSnapshot("errors");
  });

  it("should work with assets info", async () => {
    const compiler = getCompiler(
      "./entry.js",
      {},
      {
        devtool: "source-map",
        output: {
          path: `${__dirname}/dist`,
          filename: "[name].js?var=[hash]",
          chunkFilename: "[id].[name].js?ver=[hash]",
        },
      }
    );

    new CompressionPlugin().apply(compiler);
    new CopyPluginWithAssetInfo().apply(compiler);

    const stats = await compile(compiler);

    expect(getAssetsNameAndSize(stats, compiler)).toMatchSnapshot("assets");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
    expect(getErrors(stats)).toMatchSnapshot("errors");
  });

  it("should work child compilations", async () => {
    const gzipSpy = jest.spyOn(zlib, "gzip");
    const compiler = getCompiler(
      "./entry.js",
      {},
      {
        output: {
          path: `${__dirname}/dist`,
          filename: "[name].js?var=[hash]",
          chunkFilename: "[id].[name].js?ver=[hash]",
        },
        module: {
          rules: [
            {
              test: /number\.js$/i,
              rules: [
                {
                  loader: require.resolve(
                    "./helpers/loader-with-child-compilation.js"
                  ),
                },
              ],
            },
            {
              test: /\.(png|jpg|gif|svg)$/i,
              rules: [
                {
                  loader: "file-loader",
                },
              ],
            },
          ],
        },
      }
    );

    new CompressionPlugin().apply(compiler);

    const stats = await compile(compiler);

    expect(gzipSpy).toHaveBeenCalledTimes(5);
    expect(getAssetsNameAndSize(stats, compiler)).toMatchSnapshot("assets");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
    expect(getErrors(stats)).toMatchSnapshot("errors");

    gzipSpy.mockRestore();
  });

  it("should work with multiple plugins", async () => {
    const compiler = getCompiler(
      "./entry.js",
      {},
      {
        output: {
          path: `${__dirname}/dist`,
          filename: "[name].js?var=[hash]",
          chunkFilename: "[id].[name].js?ver=[hash]",
        },
      }
    );

    new CompressionPlugin({
      algorithm: "gzip",
      filename: "[path][base].gz",
    }).apply(compiler);
    new CompressionPlugin({
      algorithm: "brotliCompress",
      filename: "[path][base].br",
    }).apply(compiler);
    new CompressionPlugin({
      minRatio: Infinity,
      algorithm: (input, options, callback) => callback(null, input),
      filename: "[path][base].compress",
    }).apply(compiler);
    new CompressionPlugin({
      minRatio: Infinity,
      algorithm: (input, options, callback) => callback(null, input),
      filename: "[path][base].custom?foo=bar#hash",
    }).apply(compiler);

    const stats = await compile(compiler);

    expect(getAssetsNameAndSize(stats, compiler)).toMatchSnapshot("assets");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
    expect(getErrors(stats)).toMatchSnapshot("errors");
  });

  it("should work and show compress assets in stats", async () => {
    const compiler = getCompiler(
      "./entry.js",
      {},
      {
        stats: "verbose",
        output: {
          path: `${__dirname}/dist`,
          filename: "[name].js",
          chunkFilename: "[id].[name].js",
        },
      }
    );

    new CompressionPlugin().apply(compiler);

    const stats = await compile(compiler);
    const stringStats = stats.toString({ relatedAssets: true });
    const printedCompressed = stringStats.match(/\[compressed]/g);

    expect(printedCompressed ? printedCompressed.length : 0).toBe(3);
    expect(getAssetsNameAndSize(stats, compiler)).toMatchSnapshot("assets");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
    expect(getErrors(stats)).toMatchSnapshot("errors");
  });

  it("should work and keep assets info", async () => {
    const compiler = getCompiler(
      "./entry.js",
      {},
      {
        stats: "verbose",
        output: {
          path: `${__dirname}/dist`,
          filename: "[name].[contenthash].js",
          chunkFilename: "[id].[name].[contenthash].js",
        },
      }
    );

    new CompressionPlugin().apply(compiler);

    const stats = await compile(compiler);

    for (const [, info] of stats.compilation.assetsInfo.entries()) {
      expect(info.immutable).toBe(true);
    }

    expect(getAssetsNameAndSize(stats, compiler)).toMatchSnapshot("assets");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
    expect(getErrors(stats)).toMatchSnapshot("errors");
  });

  it('should work and use memory cache without options in the "development" mode', async () => {
    const compiler = getCompiler("./entry.js", {}, { mode: "development" });

    new CompressionPlugin().apply(compiler);

    const stats = await compile(compiler);

    expect(stats.compilation.emittedAssets.size).toBe(7);

    expect(getAssetsNameAndSize(stats, compiler)).toMatchSnapshot("assets");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
    expect(getErrors(stats)).toMatchSnapshot("errors");

    await new Promise(async (resolve) => {
      const newStats = await compile(compiler);

      expect(newStats.compilation.emittedAssets.size).toBe(0);

      expect(getAssetsNameAndSize(newStats, compiler)).toMatchSnapshot(
        "assets"
      );
      expect(getWarnings(newStats)).toMatchSnapshot("errors");
      expect(getErrors(newStats)).toMatchSnapshot("warnings");

      resolve();
    });
  });

  it('should work and use memory cache when the "cache" option is "true"', async () => {
    const compiler = getCompiler(
      "./entry.js",
      {},
      {
        cache: true,
        output: {
          path: path.resolve(__dirname, "./outputs"),
          filename: "[name].js",
          chunkFilename: "[id].js",
        },
      }
    );

    new CompressionPlugin().apply(compiler);

    const stats = await compile(compiler);

    expect(stats.compilation.emittedAssets.size).toBe(7);

    expect(getAssetsNameAndSize(stats, compiler)).toMatchSnapshot("assets");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
    expect(getErrors(stats)).toMatchSnapshot("errors");

    await new Promise(async (resolve) => {
      const newStats = await compile(compiler);

      expect(newStats.compilation.emittedAssets.size).toBe(0);

      expect(getAssetsNameAndSize(newStats, compiler)).toMatchSnapshot(
        "assets"
      );
      expect(getWarnings(newStats)).toMatchSnapshot("errors");
      expect(getErrors(newStats)).toMatchSnapshot("warnings");

      resolve();
    });
  });

  it('should work and use memory cache when the "cache" option is "true" and the asset has been changed', async () => {
    const compiler = getCompiler(
      "./entry.js",
      {},
      {
        cache: true,
        output: {
          path: path.resolve(__dirname, "./outputs"),
          filename: "[name].js",
          chunkFilename: "[id].js",
        },
      }
    );

    new CompressionPlugin().apply(compiler);

    const stats = await compile(compiler);

    expect(stats.compilation.emittedAssets.size).toBe(7);

    expect(getAssetsNameAndSize(stats, compiler)).toMatchSnapshot("assets");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
    expect(getErrors(stats)).toMatchSnapshot("errors");

    new ModifyExistingAsset({
      name: "main.js",
      content: "function changed() { /*! CHANGED */ }",
    }).apply(compiler);

    await new Promise(async (resolve) => {
      const newStats = await compile(compiler);

      expect(newStats.compilation.emittedAssets.size).toBe(2);

      expect(getAssetsNameAndSize(newStats, compiler)).toMatchSnapshot(
        "assets"
      );
      expect(getWarnings(newStats)).toMatchSnapshot("errors");
      expect(getErrors(newStats)).toMatchSnapshot("warnings");

      resolve();
    });
  });

  it('should work and use memory cache when the "cache" option is "true" and the asset has been changed which filtered by the "minRation" option', async () => {
    const compiler = getCompiler(
      "./entry.js",
      {
        name: "[name].[ext]",
      },
      {
        cache: true,
        output: {
          path: path.resolve(__dirname, "./outputs"),
          filename: "[name].js",
          chunkFilename: "[id].js",
        },
      }
    );

    new CompressionPlugin().apply(compiler);

    const stats = await compile(compiler);

    expect(stats.compilation.emittedAssets.size).toBe(7);

    expect(getAssetsNameAndSize(stats, compiler)).toMatchSnapshot("assets");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
    expect(getErrors(stats)).toMatchSnapshot("errors");

    new ModifyExistingAsset({
      name: "icon.png",
      content: `1q!Q2w@W3e#e4r$r`.repeat(1000),
    }).apply(compiler);

    await new Promise(async (resolve) => {
      const newStats = await compile(compiler);

      expect(newStats.compilation.emittedAssets.size).toBe(2);

      expect(getAssetsNameAndSize(newStats, compiler)).toMatchSnapshot(
        "assets"
      );
      expect(getWarnings(newStats)).toMatchSnapshot("errors");
      expect(getErrors(newStats)).toMatchSnapshot("warnings");

      resolve();
    });
  });

  it('should work and use memory cache when the "cache" option is "true" with multiple plugins', async () => {
    const compiler = getCompiler(
      "./entry.js",
      {},
      {
        cache: true,
        output: {
          path: path.resolve(__dirname, "./outputs"),
          filename: "[name].js",
          chunkFilename: "[id].js",
        },
      }
    );

    new CompressionPlugin({
      filename: "[path][base].gz",
      algorithm: "gzip",
    }).apply(compiler);
    new CompressionPlugin({
      filename: "[path][base].br",
      algorithm: "brotliCompress",
    }).apply(compiler);
    new CompressionPlugin({
      minRatio: Infinity,
      algorithm: (input, options, callback) => callback(null, input),
      filename: "[path][base].custom",
    }).apply(compiler);

    const stats = await compile(compiler);

    expect(stats.compilation.emittedAssets.size).toBe(14);

    expect(getAssetsNameAndSize(stats, compiler)).toMatchSnapshot("assets");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
    expect(getErrors(stats)).toMatchSnapshot("errors");

    await new Promise(async (resolve) => {
      const newStats = await compile(compiler);

      expect(newStats.compilation.emittedAssets.size).toBe(0);

      expect(getAssetsNameAndSize(newStats, compiler)).toMatchSnapshot(
        "assets"
      );
      expect(getWarnings(newStats)).toMatchSnapshot("errors");
      expect(getErrors(newStats)).toMatchSnapshot("warnings");

      resolve();
    });
  });

  it("should work with multiple plugins and using same filename", async () => {
    const compiler = getCompiler(
      "./entry.js",
      {},
      {
        output: {
          path: `${__dirname}/dist`,
          filename: "[name].js",
          chunkFilename: "[id].[name].js",
        },
      }
    );

    new CompressionPlugin({
      algorithm: "brotliCompress",
      filename: "[path]/br/[file]",
      minRatio: Infinity,
    }).apply(compiler);
    new CompressionPlugin({
      algorithm: "gzip",
      filename: "[file]",
      minRatio: Infinity,
      deleteOriginalAssets: true,
    }).apply(compiler);

    await new Promise(async (resolve) => {
      const newStats = await compile(compiler);

      // expect(newStats.compilation.emittedAssets.size).toBe(8);

      expect(getAssetsNameAndSize(newStats, compiler)).toMatchSnapshot(
        "assets"
      );
      expect(getWarnings(newStats)).toMatchSnapshot("errors");
      expect(getErrors(newStats)).toMatchSnapshot("warnings");

      resolve();
    });
  });

  it("should work with multiple plugins and using same filename and keep source maps", async () => {
    const compiler = getCompiler(
      "./entry.js",
      {},
      {
        devtool: "source-map",
        output: {
          path: `${__dirname}/dist`,
          filename: "[name].js",
          chunkFilename: "[id].[name].js",
        },
      }
    );

    new CompressionPlugin({
      algorithm: "brotliCompress",
      filename: "[path]/br/[file]",
      minRatio: Infinity,
    }).apply(compiler);
    new CompressionPlugin({
      algorithm: "gzip",
      filename: "[file]",
      minRatio: Infinity,
      deleteOriginalAssets: "keep-source-map",
    }).apply(compiler);

    await new Promise(async (resolve) => {
      const newStats = await compile(compiler);

      // expect(newStats.compilation.emittedAssets.size).toBe(8);

      expect(getAssetsNameAndSize(newStats, compiler)).toMatchSnapshot(
        "assets"
      );
      expect(getWarnings(newStats)).toMatchSnapshot("errors");
      expect(getErrors(newStats)).toMatchSnapshot("warnings");

      resolve();
    });
  });

  it('should work and do not use memory cache when the "cache" option is "false"', async () => {
    const compiler = getCompiler(
      "./entry.js",
      {
        name: "[name].[ext]",
      },
      {
        cache: false,
        output: {
          path: path.resolve(__dirname, "./outputs"),
          filename: "[name].js",
          chunkFilename: "[id].[name].js",
        },
      }
    );

    new CompressionPlugin().apply(compiler);

    const stats = await compile(compiler);

    expect(stats.compilation.emittedAssets.size).toBe(7);

    expect(getAssetsNameAndSize(stats, compiler)).toMatchSnapshot("assets");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
    expect(getErrors(stats)).toMatchSnapshot("errors");

    await new Promise(async (resolve) => {
      const newStats = await compile(compiler);

      expect(newStats.compilation.emittedAssets.size).toBe(7);

      expect(getAssetsNameAndSize(newStats, compiler)).toMatchSnapshot(
        "assets"
      );
      expect(getWarnings(newStats)).toMatchSnapshot("errors");
      expect(getErrors(newStats)).toMatchSnapshot("warnings");

      resolve();
    });
  });

  it("should run plugin against assets added later by plugins", async () => {
    const compiler = getCompiler(
      "./number.js",
      {},
      {
        output: {
          path: path.resolve(__dirname, "./outputs"),
          filename: "[name].js",
          chunkFilename: "[id].js",
        },
      }
    );

    new CompressionPlugin({ minRatio: 10 }).apply(compiler);
    new EmitNewAsset({ name: "newFile.js" }).apply(compiler);

    const stats = await compile(compiler);

    expect(getAssetsNameAndSize(stats, compiler)).toMatchSnapshot("assets");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
    expect(getErrors(stats)).toMatchSnapshot("errors");
  });

  // TODO broken on windows https://github.com/GoogleChrome/workbox/issues/2667
  it.skip("should work with 'workbox-webpack-plugin' (GenerateSW)", async () => {
    const compiler = getCompiler(
      "./entry.js",
      {},
      {
        output: {
          path: `${__dirname}/dist`,
          filename: "[name].js?var=[hash]",
          chunkFilename: "[id].[name].js?ver=[hash]",
        },
      }
    );

    new CompressionPlugin().apply(compiler);
    new GenerateSW().apply(compiler);

    const stats = await compile(compiler);

    expect(getAssetsNameAndSize(stats, compiler)).toMatchSnapshot("assets");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
    expect(getErrors(stats)).toMatchSnapshot("errors");
  });

  // TODO broken on windows https://github.com/GoogleChrome/workbox/issues/2667
  it.skip("should work with 'workbox-webpack-plugin' (InjectManifest)", async () => {
    const compiler = getCompiler(
      "./entry.js",
      {},
      {
        output: {
          path: `${__dirname}/dist`,
          filename: "[name].js?var=[hash]",
          chunkFilename: "[id].[name].js?ver=[hash]",
        },
      }
    );

    new CompressionPlugin().apply(compiler);
    new InjectManifest({
      swSrc: path.resolve(__dirname, "./fixtures/sw.js"),
    }).apply(compiler);

    const stats = await compile(compiler);

    expect(getAssetsNameAndSize(stats, compiler)).toMatchSnapshot("assets");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
    expect(getErrors(stats)).toMatchSnapshot("errors");
  });

  it("should work with 'webpack-stats-plugin'", async () => {
    const compiler = getCompiler("./entry.js");

    new CompressionPlugin().apply(compiler);
    new StatsWriterPlugin().apply(compiler);

    const stats = await compile(compiler);

    expect(getAssetsNameAndSize(stats, compiler)).toMatchSnapshot("assets");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
    expect(getErrors(stats)).toMatchSnapshot("errors");
  });
});
