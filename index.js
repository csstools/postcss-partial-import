// tooling
const postcss = require('postcss');
const processor = require('postcss-import');
const resolveId = require('./lib/resolve-id');

// plugin
module.exports = postcss.plugin(
	'postcss-partial-import',
	(opts = {}) => processor(
		Object.assign(
			{
				glob: true,
				extension: '.css',
				prefix: '',
				touch: false
			},
			opts,
			opts.resolve ? {
				resolve: opts.resolve
			} : {
				resolve: resolveId
			}
		)
	)
);

// override plugin#process
module.exports.process = function (cssString, pluginOptions, processOptions) {
	return postcss([
		0 in arguments ? module.exports(pluginOptions) : module.exports()
	]).process(cssString, processOptions);
};
