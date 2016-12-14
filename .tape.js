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
		'02-touch/test:enabled': {
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
			message: 'supports { glob: true } usage'
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
		}
	}
};

const resolve = require('./lib/resolve-id');
