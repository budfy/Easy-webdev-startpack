const plugins = [
	// "src/libs/normalize.css/normalize.css",
	// "src/libs/animate.css/animate.min.css",
	// "src/libs/magnific-popup/dist/magnific-popup.css"
];

const {
	src,
	dest
} = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const map = require('gulp-sourcemaps');
const chalk = require('chalk'); // для раскрашивания сообщения в консоли

module.exports = function libs_style(done) {
	if (plugins.length > 0) {
		return src(plugins)
			.pipe(map.init())
			.pipe(sass({
				outputStyle: 'compressed'
			}).on('error', sass.logError))
			.pipe(concat('libs.min.css'))
			.pipe(map.write('../sourcemaps/'))
			.pipe(dest('build/css/'))
	} else {
		return done(console.log(chalk.redBright('No added CSS/SCSS plugins')));
	}
}
