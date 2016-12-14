// tooling
const escapeRegExp = require('./escape-reg-exp');
const glob = require('glob');
const path = require('path');
const resolveId = require('postcss-import/lib/resolve-id');
const touch = require('./touch');

// resolver
module.exports = (id, base, options) => resolveId(id, base, options).catch(
	(error) => {
		// when the glob option is truthy
		if (options.glob) {
			return new Promise(
				(resolve, reject) => glob(
					id,
					Object.assign(
						{
							cwd: base
						},
						options.glob
					),
					(globError, files) => globError ? reject(globError) : !files.length ? reject(error) : resolve(files)
				)
			);
		}

		throw error;
	}
).catch(
	(error) => {
		// when the prefix option is truthy
		if (options.prefix) {
			// prefixed file path matcher
			const prefixMatch = RegExp(`(${ escapeRegExp(path.sep) })?(${ escapeRegExp(options.prefix) })?([^${ escapeRegExp(path.sep) }]+)$`);

			// prefixed file path
			const prefixedId = id.replace(prefixMatch, `$1${ options.prefix }$3`);

			if (prefixedId !== id) {
				// resolve prefixed file path
				return resolveId(prefixedId, base, options).catch(
					() => {
						throw error;
					}
				);
			}
		}

		throw error;
	}
).catch(
	(error) => {
		// when the touch option is truthy
		if (options.touch) {
			// file extension matcher
			const extensionMatch = new RegExp(`(${ escapeRegExp(options.extension) })?$`);

			// file with extension
			const extensionedId = path.resolve(
				base,
				id.replace(extensionMatch, options.extension)
			);

			// resolve with file extension
			return touch(extensionedId).then(
				() => extensionedId
			);
		}

		// otherwise, throw error
		throw error;
	}
);
