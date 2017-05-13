// builtin tooling
const fs = require('fs');
const path = require('path');

// mkdir, then-ified
module.exports = (dir, args) => new Promise(
	(resolve, reject) => fs.mkdir(
		dir,
		args,
		// if there is no parent directory
		(error) => error && error.code === 'ENOENT'
		// make the parent directory
		? resolve(
			module.exports(path.dirname(dir), args).then(
				() => module.exports(dir, args)
			)
		)
		// otherwise, if there is an error not regarding the directory already existing
		: error && error.code !== 'EEXIST'
		// reject with the error
		? reject(error)
		// otherwise, mkdir resolves
		: resolve()
	)
);
