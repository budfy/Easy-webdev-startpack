const {
	src
} = require('gulp');
const webpConv = require('gulp-webp');
const changed = require('gulp-changed');
const multiDest = require('gulp-multi-dest');
const plumber = require('gulp-plumber');

module.exports = function webp() {
	return src('docs/img/**/*.+(png|jpg|jpeg)')
		.pipe(plumber())
		.pipe(changed('docs/img', {
			extension: '.webp'
		}))
		.pipe(webpConv())
		.pipe(multiDest(['src/img', 'docs/img']))
}