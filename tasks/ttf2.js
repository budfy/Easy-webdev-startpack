const {
  src,
  dest
} = require('gulp');
const changed = require('gulp-changed');
const ttf2woff2 = require('gulp-ttftowoff2');
const ttf2woff = require('gulp-ttf2woff');

module.exports = function ttf2(done) {
  return src('src/fonts/**/*.ttf')
    .pipe(changed('docs/fonts', {
      extension: 'woff',
      hasChanged: changed.compareLastModifiedTime
    }))
    .pipe(ttf2woff())
    .pipe(dest('docs/fonts'))
  done();
}