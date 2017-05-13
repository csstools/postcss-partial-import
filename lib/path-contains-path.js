// builtin tooling
const path = require('path');

// if path contains another path
module.exports = (parent, target) => path.resolve(parent) === path.resolve(target).slice(0, path.resolve(parent).length);
