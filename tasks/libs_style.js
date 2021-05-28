const plugins = [];

const {
	src,
	dest
} = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const map = require('gulp-sourcemaps');
const size = require('gulp-size');

module.exports = function libs_style() {
	if (plugins.length > 0) {
		return src(plugins)
			.pipe(map.init())
			.pipe(sass({
				outputStyle: 'compressed'
			}).on('error', sass.logError))
			.pipe(concat('libs.min.css'))
			.pipe(map.write('../sourcemaps/'))
			.pipe(size({
				'gzip': true,
				'pretty': true,
				'showFiles': true,
				'showTotal': true
			}))
			.pipe(dest('build/css/'))
	} else {
		return true;
	}
}