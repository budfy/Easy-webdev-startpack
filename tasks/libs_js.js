const plugins = [];
const {
	src,
	dest
} = require('gulp');
const uglify = require('gulp-uglify-es').default;
const concat = require('gulp-concat');
const map = require('gulp-sourcemaps');
const size = require('gulp-size');

module.exports = function libs_js() {
	if (plugins.length > 0)
		return src(['src/js/01_main.js', 'src/components/bem-blocks/**/*.js'])
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
	else {
		return true;
	}
}