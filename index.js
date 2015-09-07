var fetch   = require('node-fetch');
var fs      = require('fs');
var path    = require('path');
var postcss = require('postcss');
var url     = require('url');

var matchurl = /^\s*(url\(\s*(["']?)(.*)\2\s*\)|(["']?)(.*)\4)\s*$/g;
var matchweb = /^(https?:)\/\//;

var notfoundmsg = 'Could not find import: ';
var notreadmsg  = 'Could not read import: ';

module.exports = postcss.plugin('postcss-partial-import', function (opts) {
	var cwd = opts && opts.root || process.cwd();
	var enc = opts && opts.encoding || 'utf8';
	var ext = opts && opts.ext || 'css';
	var pre = opts && opts.pre || '_';

	function getPartialPath(fromdir, rawpath) {
		var rawext  = path.extname(rawpath);
		var prefix  = rawext ? '' : pre;
		var suffix  = rawext ? '' : '.' + ext;

		return fromdir + '/' + path.dirname(rawpath) + '/' + prefix + path.basename(rawpath) + suffix;
	}

	function replaceAtRuleWithPath(atrule, rawpath, iterable, fromdir, result) {
		var abspath = getPartialPath(fromdir, rawpath);

		iterable.push(new Promise(function (resolve) {
			fs.stat(abspath, function (statError, stat) {
				if (statError) {
					result.warn(notfoundmsg + rawpath, {
						node: atrule
					});

					resolve();
				} else if (stat.isFile()) {
					fs.readFile(abspath, enc, function (readError, data) {
						if (readError) {
							result.warn(notreadmsg + rawpath, {
								node: atrule
							});

							resolve();
						} else {
							resolve(result.processor.process(data, {
								from:   abspath,
								syntax: result.opts.syntax
							}).then(function (results) {
								atrule.replaceWith(results.root);
							}));
						}
					});
				} else {
					resolve();
				}
			});
		}));
	}

	function replaceAtRuleWithURL(atrule, rawpath, iterable, fromdir, result) {
		var abspath = matchweb.test(fromdir) && !matchweb.test(rawpath) ? getPartialPath(fromdir, rawpath) : rawpath;

		iterable.push(new Promise(function (resolve) {
			fetch(abspath).then(function (res) {
				return res.text();
			}).then(function (data) {
				resolve(result.processor.process(data, {
					from:   abspath,
					syntax: result.opts.syntax
				}).then(function (results) {
					atrule.replaceWith(results.root);
				}, function () {}));
			});
		}));
	}

	return function (css, result) {
		return new Promise(function (resolve) {
			var frompath = result.opts.from || css.source.input.file;
			var fromurl  = matchweb.test(frompath) && url.parse(frompath);
			var fromdir  = fromurl ? fromurl.protocol + '//' + fromurl.host + path.dirname(fromurl.path) : frompath ? path.dirname(frompath) : cwd;
			var iterable = [];

			css.walkAtRules('import', function (atrule) {
				var rawpath = atrule.params.replace(matchurl, '$3$5');

				if (rawpath) {
					if (matchweb.test(fromdir) || matchweb.test(rawpath)) {
						replaceAtRuleWithURL(atrule, rawpath, iterable, fromdir, result);
					} else {
						replaceAtRuleWithPath(atrule, rawpath, iterable, fromdir, result);
					}
				}
			});

			Promise.all(iterable).then(function () {
				resolve();
			});
		});
	};
});
