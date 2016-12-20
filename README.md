
# Partial Import <a href="https://github.com/postcss/postcss"><img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right"></a>

[![NPM Version][npm-img]][npm-url]
[![Build Status][cli-img]][cli-url]
[![Licensing][lic-image]][lic-url]
[![Changelog][log-image]][log-url]
[![Gitter Chat][git-image]][git-url]

[Partial Import] lets you use sugary `@import` statements in CSS, including [glob]-like and [Sass]-like behavior. It even lets you generates imports as a scaffolding tool.

```css
/* before: style.css */

@import "foo/bar";

/* before: foo/bar.css */

.example-1 {
    background-color: #fafafa;
}

/* after: style.css */

.example-1 {
    background-color: #fafafa;
}
```

## Options

#### `root`

Type: `String`  
Default: [`from`](https://github.com/postcss/postcss#node-source) or `process.cwd()`

The root where paths are resolved. This should be the directory containing `node_modules`.

#### `path`

Type: `String` | `Array`  
Default: `[]`

A path or paths used to locate files.

#### `plugins`

Type: `Array`  
Default: `undefined`

An array of plugins to be applied to imported file.

#### `onImport`

Type: `Function`  
Default: `null`

The function called after the import process, receiving an array of imported files.

#### `resolve`

Type: `Function`  
Default: `null`

A custom resolver, receiving the `id`, `basedir`, and `importOptions` of an import.

#### `load`

Type: `Function`  
Default: null

A custom loader, receiving the `filename`, `importOptions`, and content or
promised content.

#### `skipDuplicates`

Type: `Boolean`  
Default: `true`

Whether similar files (based on the same content) will be skipped.

#### `prefix`

Type: `String`  
Default: `""`

Leading characters conditionally prepended to imports which are not found without them. For [Sass]-like, use `"_"`.

#### `glob`

Type: `Boolean` | `Object`  
Default: `true`

Whether [glob]-like behavior should be supported by imports. An object passed here will be forwarded to [glob] in order to change pattern matching behavior.

#### `touch`

Type: `Boolean`  
Default: `false`

Whether imports should be created as files if they do not already exist.

#### `extension`

Type: `String`  
Default: `.css`

A file extension conditionally appended to touched imports which do not specify an extension.

## Usage

Add [Partial Import] to your build tool:

```bash
npm install postcss-partial-import --save-dev
```

#### Node

```js
require('postcss-partial-import').process(YOUR_CSS, { /* options */ });
```

#### PostCSS

Add [PostCSS] to your build tool:

```bash
npm install postcss --save-dev
```

Load [Partial Import] as a PostCSS plugin:

```js
postcss([
	require('postcss-partial-import')({ /* options */ })
]).process(YOUR_CSS, /* options */);
```

#### Gulp

Add [Gulp PostCSS] to your build tool:

```bash
npm install gulp-postcss --save-dev
```

Enable [Partial Import] within your Gulpfile:

```js
var postcss = require('gulp-postcss');

gulp.task('css', function () {
	return gulp.src('./src/*.css').pipe(
		postcss([
			require('postcss-partial-import')({ /* options */ })
		])
	).pipe(
		gulp.dest('.')
	);
});
```

#### Grunt

Add [Grunt PostCSS] to your build tool:

```bash
npm install grunt-postcss --save-dev
```

Enable [Partial Import] within your Gruntfile:

```js
grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
	postcss: {
		options: {
			use: [
				require('postcss-partial-import')({ /* options */ })
			]
		},
		dist: {
			src: '*.css'
		}
	}
});
```

[npm-url]: https://www.npmjs.com/package/postcss-partial-import
[npm-img]: https://img.shields.io/npm/v/postcss-partial-import.svg
[cli-url]: https://travis-ci.org/jonathantneal/postcss-partial-import
[cli-img]: https://img.shields.io/travis/jonathantneal/postcss-partial-import.svg
[lic-url]: LICENSE.md
[lic-image]: https://img.shields.io/npm/l/postcss-partial-import.svg
[log-url]: CHANGELOG.md
[log-image]: https://img.shields.io/badge/changelog-md-blue.svg
[git-url]: https://gitter.im/postcss/postcss
[git-image]: https://img.shields.io/badge/chat-gitter-blue.svg

[Partial Import]: https://github.com/jonathantneal/postcss-partial-import
[glob]: https://github.com/isaacs/node-glob#readme
[Sass]: http://sass-lang.com/guide#topic-4
[PostCSS]: https://github.com/postcss/postcss
[Gulp PostCSS]: https://github.com/postcss/gulp-postcss
[Grunt PostCSS]: https://github.com/nDmitry/grunt-postcss
