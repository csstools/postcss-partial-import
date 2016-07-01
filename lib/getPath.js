var path = require('path');

// Resolved file path
module.exports = function getPath(link, prefix, extension) {
	// the extension of the path
	var extName = path.extname(link);

	if (extName) {
		return link;
	} else {
		// the normalized path which includes a prefix and suffix
		var normalizedPath = path.join(path.dirname(link), prefix + path.basename(link) + extension);

		return normalizedPath;
	}
};
