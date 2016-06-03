var assign   = require('object-assign');
var fs       = require('fs-promise');
var hash     = require('string-hash');
var path     = require('path');
var postcss  = require('postcss');
var pkgres   = require('resolve');

module.exports = postcss.plugin('postcss-partial-import', function (opts) {
	opts = assign({
		encoding:  'utf8',
		extension: 'css',
		prefix:    '_'
	}, opts);

	if (opts.cachedir) {
		opts.cachefile = path.join(opts.cachedir, 'imports.json');
	}

	var getModified = function (filename) {
		return fs.statSync(filename).mtime.getTime();
	};

	var isCached = function (file, cache) {
		var isDependencyCached = function (filename) {
			if (!filename) return false;

			var importCache = cache[filename];

			if (!importCache) return false;

			if (getModified(filename) !== importCache.mtime) return false;

			return !importCache.dep || !importCache.dep.some(isDependencyCached);
		};

		var importCache = cache[file];

		if (!isDependencyCached(file)) {
			if (importCache && importCache.cache) {
				fs.unlinkSync(importCache.cache);
			}

			return false;
		}

		return !!importCache.cache;
	};

	var readFromCache = function (filename, result, cache) {
		var fileCache = cache[filename].cache;

		return fs.readFile(fileCache, { encoding: opts.encoding }).then(function (contents) {
			var processor = postcss();
			var options   = assign({}, result.opts);

			options.from = filename;

			return processor.process(contents, options);
		}).then(function (results) {
			return results.root;
		});
	};

	var getPath = function (file, fromPath) {
		if (!path.extname(file)) file = path.join(path.dirname(file), opts.prefix + path.basename(file) + '.' + opts.extension);

		return path.resolve(path.dirname(fromPath), file);
	};

	var importRule = function (atRule, result, fromPath, cache) {
		var matches = /(?:url\()?['"]?([^'"\)]*)['"]?(?:\))?(?:\s+(.+))?/gi.exec(atRule.params);

		if (!matches) {
			return Promise.reject('Could not parse import: ' + atRule.params);
		}

		var ofile = matches[1];
		var media = matches[2];

		if (!ofile) {
			return Promise.reject('Empty import detected');
		}

		if (/^(https?:)?\/\//.test(ofile)) {
			return Promise.resolve();
		}

		var file = getPath(ofile, fromPath);

		return (new Promise(function (resolve) {
			pkgres(ofile, {
				packageFilter: function (pkg) {
					if (pkg.main) {
						pkg.main = pkg.style;
					}

					return pkg;
				}
			}, function (err, res) {
				if (!err) {
					file = res;
				}

				resolve();
			});
		})).then(opts.generate ? fs.ensureFile(file) : Promise.resolve()).then(function () {
			return fs.readFile(file, { encoding: opts.encoding });
		}).then(function (css) {
			var transforms = [].concat(opts.transform || []);

			var processor = postcss(transforms);
			var options   = assign({}, result.opts);

			options.from = file;

			return processor.process(css, options).then(function (results) {
				return parseStyles(results.root, results, cache).then(function () {
					if (cache && fromPath) {
						cache[fromPath] = cache[fromPath] || { dep: [] };

						if (cache[fromPath].dep.indexOf(file) === -1) cache[fromPath].dep.push(file);
					}

					if (media) {
						atRule.name = 'media';
						atRule.params = media;
						atRule.raws.between = ' ';
						atRule.append(results.root);
					} else atRule.replaceWith(results.root);
				});
			});
		});
	};

	var parseStyles = function (css, result, cache) {
		var fromPath = result.opts.from || css.source.input.file;

		if (fromPath && cache && isCached(fromPath, cache)) {
			return readFromCache(fromPath, result, cache).then(function (styles) {
				styles.nodes.forEach(function (node) {
					node.parent = css;
				});

				css.source = styles.source;
				css.nodes  = styles.nodes;
				css.raws   = styles.raws;
			});
		} else {
			var imports = [];

			css.walkAtRules('import', function (atRule) {
				imports.push(importRule(atRule, result, fromPath, cache));
			});

			// Only add dependencies when first adding file to the cache.
			// Code reused from postcss-import: https://github.com/postcss/postcss-import
			if (typeof opts.addDependencyTo === 'object' && typeof opts.addDependencyTo.addDependency === 'function') {
				opts.addDependencyTo.addDependency(fromPath);
			}

			return Promise.all(imports).then(function () {
				if (fromPath && cache) {
					cache[fromPath] = cache[fromPath] || {};

					cache[fromPath].mtime = getModified(fromPath);

					if (imports.length) {
						var output        = css.toResult().css;
						var cacheFilename = path.resolve(opts.cachedir, hash(output) + '.css');

						cache[fromPath].cache = cacheFilename;

						return fs.writeFile(cacheFilename, output);
					}
				}
			});
		}
	};

	return function (css, result) {
		var cache;

		if (opts.cachedir) {
			fs.mkdirsSync(opts.cachedir);

			try {
				cache = require(opts.cachefile);
			} catch (error) {
				cache = {};
			}
		}

		return parseStyles(css, result, cache).then(function () {
			if (cache) {
				return fs.writeFile(opts.cachefile, JSON.stringify(cache));
			}
		});
	};
});
