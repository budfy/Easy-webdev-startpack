const {
	src
} = require('gulp');
const webpconv = require('gulp-webp');
const changed = require('gulp-changed');
const multiDest = require('gulp-multi-dest');
const plumber = require('gulp-plumber');
const size = require('gulp-size');

module.exports = function webp() {
	return src('build/img/**/*.+(png|jpg|jpeg)')
		.pipe(plumber())
		.pipe(changed('build/img', {
			extension: '.webp'
		}))
		.pipe(webpconv())
		.pipe(multiDest(['src/img', 'build/img']))
}