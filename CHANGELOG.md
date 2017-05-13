# Changes to PostCSS Nesting

### 4.1.0 (May 13, 2017)

- Added: Use PostCSS Import v10=
- Updated: Properly note Node v4 support in package.json

### 4.0.0 (May 11, 2017)

- Added: PostCSS v6 compatibility
- Added: Node v4 compatibility
- Added: .editorconfig
- Removed: echoing

### 3.1.1 (February 14, 2017)

- Updated: Fixed prefix handling when compiling on Windows

### 3.1.0 (December 20, 2016)

- Added: Tests for glob, extension
- Changed: Default `prefix` is now empty (`""`)
- Removed: JSCS validation

### 3.0.1 (December 14, 2016)

- Added: `lib` directory to the package

### 3.0.0 (December 14, 2016)

- Added: Plugin refactoring as an alternative version of postcss-import
- Updated: Boilerplate conventions (Node v6.9.1 LTS)

### 2.1.0 (October 18, 2016)

- Added: Use css being imported with `addDepedencyTo`
- Added: `resolve` option to override resolving paths
- Updated: Improve ability to resolve npm modules

### 2.0.0 (July 1, 2016)

- Added: Imports look in node_modules, bower_components, etc
- Added: `dirs` lets imports look in user specified directories
- Added: `plugins` lets PostCSS plugins run over individual partials
- Removed: Caching (for now)
- Updated: Complete rewrite of the plugin
- Updated: `extension` now includes the dot (e.g. `.css`)

### 1.3.0 (September 14, 2015)

- Added: Support for generating imported files
- Updated: Switched to `fs-promise` from `fs` and `mkdirp`
- Updated: Switched to `assign` from `_extend`

### 1.2.0 (September 9, 2015)

- Added: Support for media queries
- Added: Support for caching sources

### 1.1.1 (September 8, 2015)

- Fixed: Plugins no longer run on imports

### 1.1.0 (September 8, 2015)

- Updated: Refactored code
- Removed: `root` option

### 1.0.1 (September 8, 2015)

- Fixed: Package dependencies
- Fixed: Documented syntax

### 1.0.0 (September 7, 2015)

- Added: Initial release
