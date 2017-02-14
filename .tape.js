module.exports = {
	'postcss-partial-import': {
		'01-basic/test': {
			message: 'supports basic usage'
		},
		'02-touch/test': {
			message: 'supports { touch: false } with missing import usage',
			error: {
				message: /^Failed to find 'import1.css'/
			}
		},
		'02-touch/test:true': {
			message: 'supports { touch: true } with missing import usage',
			options: {
				touch: true
			},
			warning: 1,
			after: () => new Promise(
				(resolve, reject) => require('fs').unlink(
					require('path').resolve('test', '02-touch', 'import1.css'),
					(error) => error ? reject(error) : resolve()
				)
			)
		},
		'03-glob/test': {
			message: 'supports { glob: true } usage',
			options: {
				glob: true
			}
		},
		'03-glob/test:false': {
			message: 'supports { glob: false } usage',
			options: {
				glob: false
			},
			error: {
				message: /^Failed to find 'dir1\/\*\.css'/
			}
		},
		'04-resolve/test': {
			message: 'supports { resolve: customFn } usage',
			options: {
				resolve: (id, base, options) => /import1/.test(id) ?
				// Replace import1 with import 2
				resolve(id.replace('import1', 'import2'), base, options) :
				// Otherwise, use the regular resolve
				resolve(id, base, options)
			}
		},
		'05-pcss/test': {
			message: 'supports { extension: ".pcss" } usage',
			options: {
				extension: '.pcss'
			}
		},
		'06-prefix/test': {
			message: 'supports { prefix: "_" } usage',
			options: {
				prefix: '_'
			}
		}
	}
};

const resolve = require('./lib/resolve-id');
