const {
	src,
	dest
} = require('gulp');
const changed = require('gulp-changed');
const ttf2woff2 = require('gulp-ttf2woff2');
const ttf2woff = require('gulp-ttf2woff');

module.exports = function ttf(done) {
	src('src/fonts/**/*.ttf')
		.pipe(changed('build/fonts', {
			extension: '.woff2',
			hasChanged: changed.compareLastModifiedTime
		}))
		.pipe(ttf2woff2())
		.pipe(dest('build/fonts'))

	src('src/fonts/**/*.ttf')
		.pipe(changed('build/fonts', {
			extension: 'woff',
			hasChanged: changed.compareLastModifiedTime
		}))
		.pipe(ttf2woff())
		.pipe(dest('build/fonts'))
	done();
}
