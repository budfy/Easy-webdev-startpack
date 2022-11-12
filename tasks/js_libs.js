const plugins = [
	// 'src/libs/jquery/dist/jquery.min.js',
	// 'src/libs/waypoints/waypoints.min.js',
	// 'src/libs/magnific-popup/dist/jquery.magnific-popup.min.js',
	// 'src/libs/jquery.stellar/jquery.stellar.min.js'
];
const {
	src,
	dest
} = require('gulp');
const uglify = require('gulp-uglify-es').default;
const concat = require('gulp-concat');
const map = require('gulp-sourcemaps');
const chalk = require('chalk');

module.exports = function libs_js(done) {
	if (plugins.length > 0)
		return src(plugins)
			.pipe(map.init())
			.pipe(uglify())
			.pipe(concat('libs.min.js'))
			.pipe(map.write('../sourcemaps'))
			.pipe(dest('build/js/'))
	else {
		return done(console.log(chalk.redBright('No added JS plugins')));
	}
}
