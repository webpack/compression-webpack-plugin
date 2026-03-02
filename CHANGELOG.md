# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [12.0.0](https://github.com/webpack/compression-webpack-plugin/compare/v11.1.0...v12.0.0) (2026-03-02)


### ⚠ BREAKING CHANGES

* minimum supported `Node.js` version is `20.9.0` ([#423](https://github.com/webpack/compression-webpack-plugin/issues/423)) ([5d0ab70](https://github.com/webpack/compression-webpack-plugin/commit/5d0ab7089eda9d27f639d70a43496ba06c1d7645))

## [11.1.0](https://github.com/webpack-contrib/compression-webpack-plugin/compare/v11.0.0...v11.1.0) (2024-02-27)


### Features

* support the `deleteOriginalAssets` option as a function ([#380](https://github.com/webpack-contrib/compression-webpack-plugin/issues/380)) ([1be8955](https://github.com/webpack-contrib/compression-webpack-plugin/commit/1be895599c15c7da796ef5131de4f705de3f2635))


### Bug Fixes

* `test`/`include`/`exclude` types ([#379](https://github.com/webpack-contrib/compression-webpack-plugin/issues/379)) ([4c9f6f4](https://github.com/webpack-contrib/compression-webpack-plugin/commit/4c9f6f4f4b3a1e61962e190ea2d651d23175aa18))

## [11.0.0](https://github.com/webpack-contrib/compression-webpack-plugin/compare/v10.0.0...v11.0.0) (2024-01-15)


### ⚠ BREAKING CHANGES

* minimum supported Node.js version is `18.12.0` ([2ef7b37](https://github.com/webpack-contrib/compression-webpack-plugin/commit/2ef7b3724a841285a0dcadc2bd68c307d299ef48))

## [10.0.0](https://github.com/webpack-contrib/compression-webpack-plugin/compare/v9.2.0...v10.0.0) (2022-05-17)


### ⚠ BREAKING CHANGES

* default filename is `[path][base].br` for brotli (#286)
* minimum supported `Node.js` version is `14.15.0` (#301)

### Bug Fixes

* default filename is `[path][base].br` for brotli ([#286](https://github.com/webpack-contrib/compression-webpack-plugin/issues/286)) ([db04e14](https://github.com/webpack-contrib/compression-webpack-plugin/commit/db04e144f2beb4ff0993a007c11d51ade70cc741))


* minimum supported `Node.js` version is `14.15.0` ([#301](https://github.com/webpack-contrib/compression-webpack-plugin/issues/301)) ([5db3255](https://github.com/webpack-contrib/compression-webpack-plugin/commit/5db32551830f58bb52c990c8ea94e0e4bd8efee6))

## [9.2.0](https://github.com/webpack-contrib/compression-webpack-plugin/compare/v9.1.2...v9.2.0) (2021-12-16)


### Features

* removed cjs wrapper and generated types in commonjs format (`export =` and `namespaces` used in types), now you can directly use exported types ([#277](https://github.com/webpack-contrib/compression-webpack-plugin/issues/277)) ([8664d36](https://github.com/webpack-contrib/compression-webpack-plugin/commit/8664d36f2ea36afc52cc01998f543c055dc1da15))

### [9.1.2](https://github.com/webpack-contrib/compression-webpack-plugin/compare/v9.1.0...v9.1.2) (2021-12-13)


### Bug Fixes

* types ([76009b7](https://github.com/webpack-contrib/compression-webpack-plugin/commit/76009b7ecd7495e56f9a59b60abfab4c20dca4b9))
* types ([#276](https://github.com/webpack-contrib/compression-webpack-plugin/issues/276)) ([c5c3dba](https://github.com/webpack-contrib/compression-webpack-plugin/commit/c5c3dba72b91bb020c3c142c43f264869ccde3d1))

### [9.1.1](https://github.com/webpack-contrib/compression-webpack-plugin/compare/v9.1.0...v9.1.1) (2021-12-09)


### Bug Fixes

* added `types` to `package.json` ([0acff90](https://github.com/webpack-contrib/compression-webpack-plugin/commit/0acff903ded3fae933e0cc2c9727e3637310f5af))

## [9.1.0](https://github.com/webpack-contrib/compression-webpack-plugin/compare/v9.0.1...v9.1.0) (2021-12-09)


### Features

* added types ([#269](https://github.com/webpack-contrib/compression-webpack-plugin/issues/269)) ([02d9b2a](https://github.com/webpack-contrib/compression-webpack-plugin/commit/02d9b2a672985c7862bced28f5927e779eccbba6))

### [9.0.1](https://github.com/webpack-contrib/compression-webpack-plugin/compare/v9.0.0...v9.0.1) (2021-11-17)


### Chore

* update `schema-utils` package to `4.0.0` version

## [9.0.0](https://github.com/webpack-contrib/compression-webpack-plugin/compare/v8.0.1...v9.0.0) (2021-09-11)


### ⚠ BREAKING CHANGES

* `pathData` as first argument of a custom function for the `filename` option was changed, now we pass only `pathData.filename`, see [example](https://github.com/webpack-contrib/compression-webpack-plugin#function-1)

### Features

* migrate on webpack API for getting filename ([59fe68c](https://github.com/webpack-contrib/compression-webpack-plugin/commit/59fe68c2c6047c9a6120856b3aa4fc6ab1fc811d))
* output documentation links on errors ([#255](https://github.com/webpack-contrib/compression-webpack-plugin/issues/255)) ([8624e44](https://github.com/webpack-contrib/compression-webpack-plugin/commit/8624e44b9e76dacb8d67d762c647777c6a8f9573))

### [8.0.1](https://github.com/webpack-contrib/compression-webpack-plugin/compare/v8.0.0...v8.0.1) (2021-06-25)

### Chore

* update `serialize-javascript`

## [8.0.0](https://github.com/webpack-contrib/compression-webpack-plugin/compare/v7.1.2...v8.0.0) (2021-05-21)


### ⚠ BREAKING CHANGES

* minimum supported `Node.js` version is `12.13.0`

### [7.1.2](https://github.com/webpack-contrib/compression-webpack-plugin/compare/v7.1.1...v7.1.2) (2021-01-11)


### Bug Fixes

* crash when `filename` and `algorithm` options are functions ([#241](https://github.com/webpack-contrib/compression-webpack-plugin/issues/241)) ([f33424a](https://github.com/webpack-contrib/compression-webpack-plugin/commit/f33424a441323eaeb9415886f8c7f4bb95f01f6b))

### [7.1.1](https://github.com/webpack-contrib/compression-webpack-plugin/compare/v7.1.0...v7.1.1) (2020-12-25)


### Bug Fixes

* compatibility with old plugins ([#237](https://github.com/webpack-contrib/compression-webpack-plugin/issues/237)) ([863c340](https://github.com/webpack-contrib/compression-webpack-plugin/commit/863c34032c5a025c0ea64c2fca24e35dae5f2bfb))

## [7.1.0](https://github.com/webpack-contrib/compression-webpack-plugin/compare/v7.0.0...v7.1.0) (2020-12-18)


### Features

* compress assets added later by plugins ([5b8b356](https://github.com/webpack-contrib/compression-webpack-plugin/commit/5b8b356255fe970d5cb9ffdbc4be44d41e201dc6))


### Bug Fixes

* compatibility with `workbox-webpack-plugin` ([#234](https://github.com/webpack-contrib/compression-webpack-plugin/issues/234)) ([5d54128](https://github.com/webpack-contrib/compression-webpack-plugin/commit/5d54128682b7e43432e95e6b05b6d9fa3d69fc4c))
* perf

## [7.0.0](https://github.com/webpack-contrib/compression-webpack-plugin/compare/v6.1.1...v7.0.0) (2020-12-02)


### ⚠ BREAKING CHANGES

* minimum supported webpack version is `^5.1.0`
* the `cache` option was removed, the plugin respects caching from configurations, please [read](https://webpack.js.org/configuration/other-options/#cache)

### [6.1.1](https://github.com/webpack-contrib/compression-webpack-plugin/compare/v6.1.0...v6.1.1) (2020-11-12)


### Bug Fixes

* compatibility with child compilations ([5e3bb95](https://github.com/webpack-contrib/compression-webpack-plugin/commit/5e3bb9516499438e43dba69db6257b37da4fc5ef))

## [6.1.0](https://github.com/webpack-contrib/compression-webpack-plugin/compare/v6.0.5...v6.1.0) (2020-11-09)


### Features

* added the `keep-source-maps` value to the `deleteOriginalAssets` option ([#216](https://github.com/webpack-contrib/compression-webpack-plugin/issues/216)) ([bd60650](https://github.com/webpack-contrib/compression-webpack-plugin/commit/bd6065030c387ac371a2685c445b27d96be09868))

### [6.0.5](https://github.com/webpack-contrib/compression-webpack-plugin/compare/v6.0.4...v6.0.5) (2020-11-02)


### Bug Fixes

* allowed compressed assets to overwrite original assets using the `deleteOriginalAssets` option ([62d3d0a](https://github.com/webpack-contrib/compression-webpack-plugin/commit/62d3d0a39186b160b5f1e175e883bba55ba984ff))

### [6.0.4](https://github.com/webpack-contrib/compression-webpack-plugin/compare/v6.0.3...v6.0.4) (2020-10-26)


### Bug Fixes

* always set compression level to maximum for the custom `algorithm` ([483f328](https://github.com/webpack-contrib/compression-webpack-plugin/commit/483f328d571b1953db36fbc759570b5fa90d474e))

### [6.0.3](https://github.com/webpack-contrib/compression-webpack-plugin/compare/v6.0.2...v6.0.3) (2020-10-09)

### Chore

* update `schema-utils`

### [6.0.2](https://github.com/webpack-contrib/compression-webpack-plugin/compare/v6.0.1...v6.0.2) (2020-09-19)


### Bug Fixes

* cache invalidation ([2284b0c](https://github.com/webpack-contrib/compression-webpack-plugin/commit/2284b0c8eb44040bed648b78804af2f627188172))

### [6.0.1](https://github.com/webpack-contrib/compression-webpack-plugin/compare/v6.0.0...v6.0.1) (2020-09-16)


### Bug Fixes

* respect directories in output ([#200](https://github.com/webpack-contrib/compression-webpack-plugin/issues/200)) ([91382cf](https://github.com/webpack-contrib/compression-webpack-plugin/commit/91382cfe4c01cedcfcbce546cb992112ffa4374a))

## [6.0.0](https://github.com/webpack-contrib/compression-webpack-plugin/compare/v5.0.2...v6.0.0) (2020-09-14)


### ⚠ BREAKING CHANGES

* default value of the `filename` option was changed to `"[path][base].gz"`
* removed the `[dir]` placeholder, please use the `[path]` placeholder
* the `Function` type of the `filename` option should return value with placeholders, please see an [example](https://github.com/webpack-contrib/compression-webpack-plugin#function-1)

### Features

* added `[fragment]`, `[base]` and `[path]` placeholders for the `filename` option

### Bug Fixes

* caching ([#194](https://github.com/webpack-contrib/compression-webpack-plugin/issues/194)) ([9de2a88](https://github.com/webpack-contrib/compression-webpack-plugin/commit/9de2a88ccb7b16a84a4e1e08ae0889bc589a0089))
* respect `immutable` flag for assets

### [5.0.2](https://github.com/webpack-contrib/compression-webpack-plugin/compare/v5.0.1...v5.0.2) (2020-09-02)


### Bug Fixes

* do not crash when the `algorithm` option return non `Buffer` ([#190](https://github.com/webpack-contrib/compression-webpack-plugin/issues/190)) ([81bf601](https://github.com/webpack-contrib/compression-webpack-plugin/commit/81bf60166caeeea9f5d5a18e1471ed0f7a28c312))

### [5.0.1](https://github.com/webpack-contrib/compression-webpack-plugin/compare/v5.0.0...v5.0.1) (2020-08-22)


### Bug Fixes

* compatibility with webpack@5 ([84e367b](https://github.com/webpack-contrib/compression-webpack-plugin/commit/84e367b03c9440afd9cab410c680837829543cbe))

## [5.0.0](https://github.com/webpack-contrib/compression-webpack-plugin/compare/v4.0.1...v5.0.0) (2020-08-17)


### ⚠ BREAKING CHANGES

* default value of the `filename` option is `'[path].gz'`
* use `processAssets` hook for `webpack@5` compatibility, it can create incompatibility with plugins that do not support `webpack@5`, please open an issue in their repositories

### Features

* improve compatibility with `webpack@5` ([1f9674e](https://github.com/webpack-contrib/compression-webpack-plugin/commit/1f9674e7573a2b30822c08d4c719fc4849cce793))
* improve stats output for `webpack@5`

### Bug Fixes

* fix persistent cache between builds

### [4.0.1](https://github.com/webpack-contrib/compression-webpack-plugin/compare/v4.0.0...v4.0.1) (2020-08-12)


### Bug Fixes

* cache invalidation ([025b778](https://github.com/webpack-contrib/compression-webpack-plugin/commit/025b778fdcd43681dac3b9a693b375d6abf79852))
* memory leak ([#174](https://github.com/webpack-contrib/compression-webpack-plugin/issues/174)) ([2a1e884](https://github.com/webpack-contrib/compression-webpack-plugin/commit/2a1e884a7f6781e13e08d82c10d244eb1868cd55))

## [4.0.0](https://github.com/webpack-contrib/compression-webpack-plugin/compare/v3.1.0...v4.0.0) (2020-05-12)


### ⚠ BREAKING CHANGES

* the `cache` is `true` by default for webpack@4
* the `cache` option is ignored in webpack 5. Please use https://webpack.js.org/configuration/other-options/#cache.
* minimum supported Node.js version is `10.13`

### Features

* enable cache by default for webpack@4 ([#164](https://github.com/webpack-contrib/compression-webpack-plugin/issues/164)) ([ea33463](https://github.com/webpack-contrib/compression-webpack-plugin/commit/ea33463b2c9986fa5dc744bd2860620af7404a7f))


### Bug Fixes

* behaviour in watch mode ([e222c4e](https://github.com/webpack-contrib/compression-webpack-plugin/commit/e222c4ee7554c0d3ce3a80749b6087b40ffd5ed1))

## [3.1.0](https://github.com/webpack-contrib/compression-webpack-plugin/compare/v3.0.0...v3.1.0) (2020-01-09)


### Features

* add `dir`, `name` and `ext` placeholders in filename option ([#144](https://github.com/webpack-contrib/compression-webpack-plugin/issues/144)) ([bf22024](https://github.com/webpack-contrib/compression-webpack-plugin/commit/bf220243bdf74595dfe97b055a8424f7365fc866))


### Bug Fixes

* support webpack@5 ([#146](https://github.com/webpack-contrib/compression-webpack-plugin/issues/146)) ([17c29a5](https://github.com/webpack-contrib/compression-webpack-plugin/commit/17c29a557743a82d0a4ac10a98c8dc90a1aef64b))

## [3.0.0](https://github.com/webpack-contrib/compression-webpack-plugin/compare/v2.0.0...v3.0.0) (2019-06-05)


### chore

* **deps:** update ([#124](https://github.com/webpack-contrib/compression-webpack-plugin/issues/124)) ([897bd95](https://github.com/webpack-contrib/compression-webpack-plugin/commit/897bd95))


### Tests

* validation ([#111](https://github.com/webpack-contrib/compression-webpack-plugin/issues/111)) ([833e825](https://github.com/webpack-contrib/compression-webpack-plugin/commit/833e825))


### BREAKING CHANGES

* **deps:** minimum required nodejs version is `8.9.0`



<a name="2.0.0"></a>
## [2.0.0](https://github.com/webpack-contrib/compression-webpack-plugin/compare/v1.1.12...v2.0.0) (2018-09-04)

### Features

* `filename` option now accept `{String}` value
* validation schema for plugin options

### BREAKING CHANGES

* enforces `peerDependencies` of `"webpack": "^4.3.0"`
* enforces `engines` of `"node": ">= 6.9.0 <7.0.0 || >= 8.9.0`
* compressed options (`options.level`, `options.flush`, `options.dictionary` and etc) grouped into `compressionOptions` option
* `asset` option was removed (use `filename` option instead)
* default value of `filename` option is now `[path].gz[query]`



<a name="1.1.12"></a>
## [1.1.12](https://github.com/webpack-contrib/compression-webpack-plugin/compare/v1.1.11...v1.1.12) (2018-08-29)

### Bug Fixes

* correct handling filename with `query` ([#105](https://github.com/webpack-contrib/compression-webpack-plugin/issues/105)) ([c8d7757](https://github.com/webpack-contrib/compression-webpack-plugin/commit/c8d7757))



<a name="1.1.11"></a>
## [1.1.11](https://github.com/webpack-contrib/compression-webpack-plugin/compare/v1.1.10...v1.1.11) (2018-03-09)


### Performance Improvements

* **index:** switch to `md4` for content hashing ([#103](https://github.com/webpack-contrib/compression-webpack-plugin/issues/103)) ([0eebc46](https://github.com/webpack-contrib/compression-webpack-plugin/commit/0eebc46))



<a name="1.1.10"></a>
## [1.1.10](https://github.com/webpack-contrib/compression-webpack-plugin/compare/v1.1.9...v1.1.10) (2018-02-27)


### Performance Improvements

* use `neo-async` instead `async` ([#98](https://github.com/webpack-contrib/compression-webpack-plugin/issues/98)) ([1cd3095](https://github.com/webpack-contrib/compression-webpack-plugin/commit/1cd3095))



<a name="1.1.9"></a>
## [1.1.9](https://github.com/webpack-contrib/compression-webpack-plugin/compare/v1.1.8...v1.1.9) (2018-02-26)


### Bug Fixes

* **package:** add `webpack >= 4` (`peerDependencies`) ([#101](https://github.com/webpack-contrib/compression-webpack-plugin/issues/101)) ([d3c29e7](https://github.com/webpack-contrib/compression-webpack-plugin/commit/d3c29e7))



<a name="1.1.8"></a>
## [1.1.8](https://github.com/webpack-contrib/compression-webpack-plugin/compare/v1.1.7...v1.1.8) (2018-02-23)


### Bug Fixes

* **index:** `tapable` deprecation warnings (`webpack >= v4.0.0`) ([#100](https://github.com/webpack-contrib/compression-webpack-plugin/issues/100)) ([d6ccdc4](https://github.com/webpack-contrib/compression-webpack-plugin/commit/d6ccdc4))



<a name="1.1.7"></a>
## [1.1.7](https://github.com/webpack-contrib/compression-webpack-plugin/compare/v1.1.6...v1.1.7) (2018-02-16)


### Bug Fixes

* **index:** reduce memory usage (`cacheKey.hash`) ([#97](https://github.com/webpack-contrib/compression-webpack-plugin/issues/97)) ([3c77d43](https://github.com/webpack-contrib/compression-webpack-plugin/commit/3c77d43))



<a name="1.1.6"></a>
## [1.1.6](https://github.com/webpack-contrib/compression-webpack-plugin/compare/v1.1.5...v1.1.6) (2018-01-29)



<a name="1.1.5"></a>
## [1.1.5](https://github.com/webpack-contrib/compression-webpack-plugin/compare/v1.1.4...v1.1.5) (2018-01-29)


### Bug Fixes

* **package:** use `prepare` instead of `prepublish` for release ([0b90a71](https://github.com/webpack-contrib/compression-webpack-plugin/commit/0b90a71))



<a name="1.1.4"></a>
## [1.1.4](https://github.com/webpack-contrib/compression-webpack-plugin/compare/v1.1.3...v1.1.4) (2018-01-29)


### Bug Fixes

* missing options `include` and `exclude` ([#95](https://github.com/webpack-contrib/compression-webpack-plugin/issues/95)) ([cc44bcb](https://github.com/webpack-contrib/compression-webpack-plugin/commit/cc44bcb))



<a name="1.1.3"></a>
## [1.1.3](https://github.com/webpack-contrib/compression-webpack-plugin/compare/v1.1.2...v1.1.3) (2017-12-22)


### Bug Fixes

* `cache` behaviour ([#91](https://github.com/webpack-contrib/compression-webpack-plugin/issues/91)) ([9791044](https://github.com/webpack-contrib/compression-webpack-plugin/commit/9791044))



<a name="1.1.2"></a>
## [1.1.2](https://github.com/webpack-contrib/compression-webpack-plugin/compare/v1.1.1...v1.1.2) (2017-12-14)


### Bug Fixes

* `text/include/exclude` option behaviour ([#88](https://github.com/webpack-contrib/compression-webpack-plugin/issues/88)) ([1d0a840](https://github.com/webpack-contrib/compression-webpack-plugin/commit/1d0a840))



<a name="1.1.1"></a>
## [1.1.1](https://github.com/webpack-contrib/compression-webpack-plugin/compare/v1.1.0...v1.1.1) (2017-12-14)


### Bug Fixes

* **index:** don't use `JSON.stringify()` to serialize the `cache` data (`options.cache`) ([#87](https://github.com/webpack-contrib/compression-webpack-plugin/issues/87)) ([0d22741](https://github.com/webpack-contrib/compression-webpack-plugin/commit/0d22741))



<a name="1.1.0"></a>
# [1.1.0](https://github.com/webpack-contrib/compression-webpack-plugin/compare/v1.0.1...v1.1.0) (2017-12-14)


### Features

* add `cache` option (`options.cache`) ([#86](https://github.com/webpack-contrib/compression-webpack-plugin/issues/86)) ([49a8a77](https://github.com/webpack-contrib/compression-webpack-plugin/commit/49a8a77))
* add `include` and `exclude` options (`options.include|options.exclude`) ([#82](https://github.com/webpack-contrib/compression-webpack-plugin/issues/82)) ([1ce3024](https://github.com/webpack-contrib/compression-webpack-plugin/commit/1ce3024))



<a name="1.0.1"></a>
## [1.0.1](https://github.com/webpack-contrib/compression-webpack-plugin/compare/v1.0.0...v1.0.1) (2017-09-29)


### Code Refactoring

* Use emit event instead of this-compilation ([#71](https://github.com/webpack-contrib/compression-webpack-plugin/pull/71)) ([9ebc852](https://github.com/webpack-contrib/compression-webpack-plugin/commit/9ebc852))


<a name="1.0.0"></a>
# [1.0.0](https://github.com/webpack-contrib/compression-webpack-plugin/compare/v1.0.0-beta.1...v1.0.0) (2017-07-15)

### Code Refactoring

* apply webpack-defaults ([#54](https://github.com/webpack-contrib/compression-webpack-plugin/issues/54)) ([f6f8c6c](https://github.com/webpack-contrib/compression-webpack-plugin/commit/f6f8c6c))


### BREAKING CHANGES

* Enforces `peerDependencies` of `"webpack": ">= 3.0.0-rc.0 || ^3.0.0"`.
* Enforces `engines` of `"node": ">=4.3.0 < 5.0.0 || >= 5.10`
* Remove loose dependency on Node Zopfli, which has been extracted to it's own plugin https://github.com/webpack-contrib/zopfli-webpack-plugin

Migration:

- `npm i -D zopfli-webpack-plugin`
- The Zopfli API has remained the same, those who were using the Zopfli option in this plugin should just need to switch plugins.


<a name="1.0.0-beta.1"></a>
# [1.0.0-beta.1](https://github.com/webpack-contrib/compression-webpack-plugin/compare/v1.0.0-beta.0...v1.0.0-beta.1) (2017-07-03)


### Code Refactoring

* Drops optional Zopfli dependency ([#65](https://github.com/webpack-contrib/compression-webpack-plugin/issues/65)) ([328048a](https://github.com/webpack-contrib/compression-webpack-plugin/commit/328048a))


### BREAKING CHANGES

* The optional dependency for Zopfli was causing issues in consumers CI / CD chains, this option has now been removed.

MIGRATION: Zopfli is now in it's own plugin the options have remained the same. For those using the Zopfli option in `compression-webpack-plugin` swap it out for `https://github.com/webpack-contrib/zopfli-webpack-plugin`



<a name="1.0.0-beta.0"></a>
# [1.0.0-beta.0](https://github.com/webpack-contrib/compression-webpack-plugin/compare/v0.4.0...v1.0.0-beta.0) (2017-06-24)


### Code Refactoring

* apply webpack-defaults ([#54](https://github.com/webpack-contrib/compression-webpack-plugin/issues/54)) ([f6f8c6c](https://github.com/webpack-contrib/compression-webpack-plugin/commit/f6f8c6c))


### BREAKING CHANGES

* Enforces `peerDependencies` of `"webpack": ">= 3.0.0-rc.0 || ^3.0.0"`.
* Enforces `engines` of `"node": ">=4.3.0 < 5.0.0 || >= 5.10`
* Remove loose dependency on Node Zopfli, which has been extracted to it's own plugin https://github.com/webpack-contrib/zopfli-webpack-plugin

Migration:

- `npm i -D zopfli-webpack-plugin`
- The Zopfli API has remained the same, those who were using the Zopfli option in this plugin should just need to switch plugins.



<a name="0.4.0"></a>
# [0.4.0](https://github.com/webpack/compression-webpack-plugin/compare/v0.3.2...v0.4.0) (2017-04-08)


### Features

* add option to change the filename ([#51](https://github.com/webpack/compression-webpack-plugin/issues/51)) ([fb7bd81](https://github.com/webpack/compression-webpack-plugin/commit/fb7bd81))
* add option to delete original assets ([#44](https://github.com/webpack/compression-webpack-plugin/issues/44)) ([24f15f2](https://github.com/webpack/compression-webpack-plugin/commit/24f15f2))



<a name="0.3.2"></a>
## 0.3.2 (2016-09-13)


### Chores

* Update node-zopfli version ([2d3dd44](https://github.com/webpack-contrib/compression-webpack-plugin/commit/2d3dd44))


<a name="0.3.1"></a>
## 0.3.1 (2016-03-26)


### Bug Fixes

* TypeError Invalid non-strig/buffer chunk ([53ec8a9](https://github.com/webpack/compression-webpack-plugin/commit/53ec8a9))

<a name="0.3.0"></a>
## 0.3.0 (2016-01-23)


### Bug Fixes

* Correct zopfli options ([1f3b595](https://github.com/webpack/compression-webpack-plugin/commit/1f3b595))
* plugin options syntax ([437bdff](https://github.com/webpack/compression-webpack-plugin/commit/437bdff))

### Features

* Add compression level option ([9d05172](https://github.com/webpack/compression-webpack-plugin/commit/9d05172))
* Add node-zopfli option ([2c22b1c](https://github.com/webpack/compression-webpack-plugin/commit/2c22b1c))
* Permit {path} and {query} in asset name ([12d167c](https://github.com/webpack/compression-webpack-plugin/commit/12d167c))

<a name="0.2.0"></a>
## 0.2.0 (2015-04-08)


### Features

* use webpack RawSource ([3c85a2b](https://github.com/webpack/compression-webpack-plugin/commit/3c85a2b))


<a name="0.1.2"></a>
## 0.1.2 (2015-04-08)


### Bug Fixes

* Double compression on worker-loader bundles ([7ce2b32](https://github.com/webpack/compression-webpack-plugin/commit/7ce2b32))
* Remove unneeded module.exports ([6f4e60d](https://github.com/webpack/compression-webpack-plugin/commit/6f4e60d))
