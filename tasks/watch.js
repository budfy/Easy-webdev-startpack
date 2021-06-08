const {
<<<<<<< HEAD
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
	watch('src/img/**/*.+(png|jpg|jpeg|gif|svg|ico)', parallel('rastr'));
	watch('build/img/**/*.+(png|jpg|jpeg)', parallel('webp'));
	watch('src/svg/css/**/*.svg', series('svg_css', 'style'));
	watch('src/svg/sprite/**/*.svg', series('svg_sprite', 'rastr'));
	watch('src/fonts/**/*.ttf', series('ttf', 'fonts'));
=======
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
  watch('src/svg/sprite/**/*.svg', series('svg_sprite', 'rastr'));
  watch('src/fonts/**/*.ttf', series('ttf', 'ttf2', 'fonts'));
>>>>>>> ad19a93b6c550eb52aa5a15c1753379c3eadc6bd
}