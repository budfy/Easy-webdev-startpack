//-------------------------------------------
// Компилируем Pug в HTML
//-------------------------------------------

const {
	src,
	dest
} = require('gulp');
// const include = require('gulp-file-include');
const pug = require('gulp-pug'); // Подключаем Pug
const bs = require('browser-sync');

// module.exports = function html() {
// 	return src(['src/**/*.html', '!!src/components/**/*.html'])
// 		.pipe(include())
// 		.pipe(dest('build'))
//     .pipe(bs.stream())
// }

module.exports = function pug_to_html() {
	return src('src/pug/*.pug')
	// .pipe(plumber())
	.pipe(pug({pretty: true})) // Компилируем с индентами
	.pipe(dest('build'))
	// .pipe(gulp.dest('dist/'))
	// .pipe(reload({stream: true}))	// Reload
	.pipe(bs.stream())
};
