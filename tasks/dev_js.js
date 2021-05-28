const {
	src,
	dest
} = require('gulp');
const uglify = require('gulp-uglify-es').default;
const concat = require('gulp-concat');
const map = require('gulp-sourcemaps');
const bs = require('browser-sync');
const size = require('gulp-size');

module.exports = function dev_js() {
	return src(['src/components/bem-blocks/**/*.js', 'src/js/01_main.js'])
		.pipe(map.init())
		.pipe(uglify())
		.pipe(concat('main.min.js'))
		.pipe(map.write('../sourcemaps'))
		.pipe(size({
			'gzip': true,
			'pretty': true,
			'showFiles': true,
			'showTotal': true
		}))
		.pipe(dest('build/js/'))
		.pipe(bs.stream())
}