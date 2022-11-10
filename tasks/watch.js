const {
  watch,
  parallel,
  series
} = require('gulp');

module.exports = function watching() {
  watch('src/**/*.html', parallel('html'));
  watch('src/**/*.php', parallel('php'));
  watch('src/**/*.scss', parallel('style'));
  watch('src/**/*.js', parallel('dev_js'));
  watch('src/**/*.json', parallel('html'));
  watch('src/img/**/*.+(svg|ico)', parallel('rastr'));
  watch('src/img/**/*.+(png|jpg|jpeg|gif)', series('rastr', 'webp'));
  watch('src/svg/css/**/*.svg', series('svg_css', 'style'));
  watch('src/svg/**/*.svg', series('svg_sprite', 'rastr'));
  watch('src/fonts/**/*.ttf', series('ttf', 'ttf2', 'fonts'));
  watch('src/**/*.!(html|php|scss|css|js|json|svg|ico|png|jpg|jpeg|webp|gif|ttf|woff|woff2|ttf2|eot)', series('transferother'));
}