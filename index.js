var postcss  = require('postcss');
var readFile = require('fs-readfile-promise');
var path     = require('path');
var extend   = require('util')._extend;

module.exports = postcss.plugin('postcss-partial-import', function (opts) {
	var enc = opts && opts.encoding || 'utf8';
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
			readFile(file, { encoding: enc }).then(function(css) {
				var processor = postcss();
				var options = extend({}, result.opts);
				options.from = file;
				processor.process(css, options).then(function (results) {
					parseStyles(results.root, results).then(function () {
						atRule.replaceWith(results.root);
						resolve();
					}, reject);
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
