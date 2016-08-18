# Partial Import

<a href="https://github.com/postcss/postcss"><img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="80" height="80" align="right"></a>

[![NPM Version][npm-img]][npm] [![Build Status][ci-img]][ci]

[Partial Import] is a [PostCSS] plugin that inlines `@import` statements in CSS. It supports partial imports like Sass, automatically looks for stylesheets within npm and Bower packages, and can generate files if they don’t already exist.

```css
/* before: file.css */

@import "foo/bar";

/* before: foo/_bar.css */

html {
    background-color: #fafafa;
}

/* after */

html {
    background-color: #fafafa;
}

```

## Usage

Follow these steps to use [Partial Import].

Add [Partial Import] to your build tool:

```bash
npm install postcss-partial-import --save-dev
```

#### Node

```js
require('postcss-partial-import')({ /* options */ }).process(YOUR_CSS);
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
]);
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
    return gulp.src('./css/src/*.css').pipe(
        postcss([
            require('postcss-partial-import')({ /* options */ })
        ])
    ).pipe(
        gulp.dest('./css')
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
            processors: [
                require('postcss-partial-import')({ /* options */ })
            ]
        },
        dist: {
            src: 'css/*.css'
        }
    }
});
```

#### CLI

Add [PostCSS] to your build tool:

```bash
npm install postcss --save-dev
```

Enable [Partial Import] from the CLI:

```bash
$ postcss --use postcss-partial-import input.css
```

Enable [Partial Import] from configuration file:

```bash
$ postcss --config my-postcss-config.json input.css
```

```json
// my-postcss-config.json
{
   "use": ["postcss-partial-import"]
 }
 ```

## Options

#### `encoding`

Type: `String`  
Default: `utf8`

The character encoding of files being imported.

#### `extension`

Type: `String`  
Default: `.css`

The file extension appended to partials being imported.

#### `prefix`

Type: `String`  
Default: `_`

The leading characters prepended to partials being imported.

#### `generate`

Type: `Boolean`  
Default: `false`

Whether partials should be generated if they do not already exist.

#### `dirs`

Type: `Array`  
Default: `[]`

A list of alternate directories to find partials in.

#### `plugins`

Type: `Array`  
Default: `[]`

A list of PostCSS plugins to run over individual partials.

#### `addDependencyTo`

Type: `function`  
Default: `null`

To pass CSS @import files to a compiler (such as webpack), which would otherwise not know which CSS files to watch for browser reloading.

*Example*

```javascript
// webpack.config.js
postcss: function(webpack) {
    return [
        require('postcss-partial-import')({
        	addDependencyTo: webpack
        })
    ];
}
```

[ci]:      https://travis-ci.org/jonathantneal/postcss-partial-import
[ci-img]:  https://img.shields.io/travis/jonathantneal/postcss-partial-import.svg
[npm]:     https://www.npmjs.com/package/postcss-partial-import
[npm-img]: https://img.shields.io/npm/v/postcss-partial-import.svg

[Gulp PostCSS]:  https://github.com/postcss/gulp-postcss
[Grunt PostCSS]: https://github.com/nDmitry/grunt-postcss
[PostCSS]:       https://github.com/postcss/postcss

[Partial Import]: https://github.com/jonathantneal/postcss-partial-import
