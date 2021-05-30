const {
	src,
	dest
} = require('gulp');
const include = require('gulp-file-include');
const bs = require('browser-sync');

module.exports = function php() {
	return src('src/**/*.php')
		.pipe(include())
		.pipe(dest('build'))
		.pipe(bs.stream())
}