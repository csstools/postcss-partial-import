var postcss  = require('postcss');
var readFile = require('fs-readfile-promise');
var path     = require('path');

module.exports = postcss.plugin('postcss-partial-import', function (opts) {
	var ext = opts && opts.extension || 'css';
	var pre = opts && opts.prefix || '_';

	var getPath = function (file, fromPath) {
		if (!path.extname(file)) file = path.join(path.dirname(file), pre + path.basename(file) + '.' + ext);
		return path.resolve(path.dirname(fromPath), file);
	};

	var importRule = function (atRule, result, fromPath) {
		return new Promise(function (resolve, reject) {
			var file = atRule.params.trim()
				.replace(/^(url\((.*)\))$/, '$2')
				.replace(/^((["'])(.*)\2)$/, '$3');

			// reject empty imports
			if (!file) return reject('Empty import detected');
			// ignore remote resources
			if (/^(https?:)?\/\//.test(file)) return resolve();

			file = getPath(file, fromPath);
			readFile(file).then(function(css) {
				var options = result.opts;
				options.from = file;
				result.processor.process(css, options).then(function (results) {
					atRule.replaceWith(results.root);
					resolve();
				}, reject);
			}, reject);
		});
	};

	var parseStyles = function (css, result) {
		return new Promise(function (resolve, reject) {
			var fromPath = result.opts.from || css.source.input.file;
			var imports = [];
			css.walkAtRules('import', function (atRule) {
				imports.push(importRule(atRule, result, fromPath));
			});
			Promise.all(imports).then(resolve, reject);
		});
	};

	return parseStyles;
});
