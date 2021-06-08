const {
<<<<<<< HEAD
	src,
	dest
=======
  src,
  dest
>>>>>>> ad19a93b6c550eb52aa5a15c1753379c3eadc6bd
} = require('gulp');
const changed = require('gulp-changed');
const ttf2woff2 = require('gulp-ttftowoff2');
const ttf2woff = require('gulp-ttf2woff');

module.exports = function ttf(done) {
<<<<<<< HEAD
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
=======
  return src('src/fonts/**/*.ttf')
    .pipe(changed('build/fonts', {
      extension: '.woff2',
      hasChanged: changed.compareLastModifiedTime
    }))
    .pipe(ttf2woff2())
    .pipe(dest('build/fonts'))
  done();
>>>>>>> ad19a93b6c550eb52aa5a15c1753379c3eadc6bd
}