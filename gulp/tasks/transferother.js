const {
  src,
  dest
} = require('gulp');

module.exports = function transferother() {
  return src('src/**/*.!(html|php|scss|css|js|json|svg|ico|png|jpg|jpeg|webp|gif|ttf|woff|woff2|ttf2|eot)').pipe(dest('./docs/'))
}