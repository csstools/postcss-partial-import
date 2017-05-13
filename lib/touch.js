// builtin tooling
const fs = require('fs');
const path = require('path');

// internal tooling
const mkdir = require('./mkdir');

// touch, then-ified
module.exports = (file) => new Promise(
	(resolve, reject) => fs.open(
		file,
		'wx',
		// if there is no parent directory
		(error) => error && error.code === 'ENOENT'
		// make the parent directory
		? resolve(
			mkdir(
				path.dirname(file)
			).then(
				() => module.exports(file)
			)
		)
		// otherwise, if there is an error not regarding the directory already existing
		: error && error.code !== 'EEXIST'
		// reject with the error
		? reject(error)
		// otherwise, touch resolves
		: resolve()
	)
);
