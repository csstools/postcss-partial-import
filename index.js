// tooling
const postcss = require('postcss');
const processor = require('postcss-import');
const resolveId = require('./lib/resolve-id');

// plugin
module.exports = postcss.plugin(
	'postcss-partial-import',
	(opts) => processor(
		Object.assign(
			{
				glob: true,
				extension: '.css',
				prefix: '',
				touch: false
			},
			opts,
			opts && opts.resolve ? {
				resolve: opts.resolve
			} : {
				resolve: resolveId
			}
		)
	)
);
