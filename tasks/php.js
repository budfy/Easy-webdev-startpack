const {
	src,
	dest
} = require('gulp');
const include = require('gulp-file-include');
const bs = require('browser-sync');
const size = require('gulp-size');

module.exports = function php() {
	return src('src/**/*.php')
		.pipe(include())
		.pipe(size({
			'gzip': true,
			'pretty': true,
			'showFiles': true,
			'showTotal': true
		}))
		.pipe(dest('build'))
		.pipe(bs.stream())
}