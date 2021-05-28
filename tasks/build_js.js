const {
	src,
	dest
} = require('gulp');
const uglify = require('gulp-uglify-es').default;
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const size = require('gulp-size');

module.exports = function build_js() {
	return src(['src/components/bem-blocks/**/*.js', 'src/js/01_main.js'])
		.pipe(uglify())
		.pipe(babel({
			presets: ['@babel/env']
		}))
		.pipe(concat('main.min.js'))
		.pipe(size({
			'gzip': true,
			'pretty': true,
			'showFiles': true,
			'showTotal': true
		}))
		.pipe(dest('build/js/'))
}