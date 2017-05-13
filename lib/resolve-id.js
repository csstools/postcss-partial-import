'use strict';

// builtin tooling
const path = require('path');

// external tooling
const glob = require('glob');
const resolveId = require('postcss-import/lib/resolve-id');

// internal tooling
const escapeRegExp = require('./escape-reg-exp');
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
		let altId = id;

		// when the prefix option is truthy
		if (options.prefix) {
			// prefixed file path matcher
			const prefixMatch = RegExp(`(${ escapeRegExp('/') })?(${ escapeRegExp(options.prefix) })?([^${ escapeRegExp('/') }]+)$`);

			// prefixed file path
			altId = altId.replace(prefixMatch, `$1${ options.prefix }$3`);
		}

		// when the prefix option is truthy
		if (options.extension) {
			// prefixed file path matcher
			const extensionMatch = RegExp(`(${ escapeRegExp(options.extension) })?$`);

			// prefixed file path
			altId = altId.replace(extensionMatch, options.extension);
		}

		if (altId !== id) {
			// resolve prefixed file path
			return resolveId(altId, base, options).catch(
				() => {
					throw error;
				}
			);
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
