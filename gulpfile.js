"use strict";

const gulp = require('gulp');
const sass = require('gulp-sass');
const bs = require('browser-sync');
const rename = require('gulp-rename');
const prefixer = require('gulp-autoprefixer');
const cleanCss = require('gulp-clean-css');
const concat = require('gulp-concat');
const map = require('gulp-sourcemaps');
const include = require('gulp-file-include');
const htmlmin = require('gulp-htmlmin');
const uglify = require('gulp-uglify-es').default;
const babel = require('gulp-babel');
const size = require('gulp-size');
const changed = require('gulp-changed');
const imagemin = require('gulp-imagemin');
const recompress = require('imagemin-jpeg-recompress');
const pngquant = require('imagemin-pngquant');
const svgmin = require('gulp-svgmin');
const svgcss = require('gulp-svg-css');
const svgsprite = require('gulp-svg-sprite');
const svgInclude = require('gulp-embed-svg');
const ttf2woff2 = require('gulp-ttftowoff2');
const ttf2woff = require('gulp-ttf2woff');
const ttf2eot = require('gulp-ttf2eot');
const fs = require('fs');
const {
	strict
} = require('assert');

let settings_size = {
		'gzip': true,
		'pretty': true,
		'showFiles': true,
		'showTotal': true
	},
	svgmin_plugins = {
		plugins: [{
				removeComments: true
			},
			{
				removeEmptyContainers: true
			}
		]
	};

gulp.task('bem_styles', () => {
	return gulp
		.src('src/components/bem-blocks/**/*.scss')
		.pipe(map.init())
		.pipe(concat('_bem-blocks.scss'))
		.pipe(map.write('../sourcemaps'))
		.pipe(size(settings_size))
		.pipe(gulp.dest('src/scss'))
});

gulp.task('libs_styles', () => {
	return gulp
		.src([
			'node_modules/normalize.css/normalize.css'
			/* insert here path to libs and plugins css/scss files by comma, like 'node_modules/lib-1/lib-1.css','node_modules/lib-2/lib-2.scss'  */
		])
		.pipe(map.init())
		.pipe(concat('libs.scss'))
		.pipe(map.write('../sourcemaps'))
		.pipe(size(settings_size))
		.pipe(gulp.dest('src/scss/'))
});

gulp.task('dev_styles', () => {
	return gulp
		.src('src/scss/**/*.scss')
		.pipe(map.init())
		.pipe(sass({
			outputStyle: 'compressed'
		}).on('error', sass.logError))
		.pipe(prefixer({
			overrideBrowserslist: ['last 8 versions'],
			browsers: [
				'Android >= 4',
				'Chrome >= 20',
				'Firefox >= 24',
				'Explorer >= 11',
				'iOS >= 6',
				'Opera >= 12',
				'Safari >= 6',
			],
		}))
		.pipe(cleanCss({
			level: 2
		}))
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(map.write('../sourcemaps'))
		.pipe(gulp.dest('build/css'))
		.pipe(size(settings_size))
		.pipe(bs.stream())
});

gulp.task('style',
	gulp.series(
		'bem_styles',
		'libs_styles',
		'dev_styles'
	)
);

gulp.task('bem_js', () => {
	return gulp
		.src('src/components/bem-blocks/**/*.js')
		.pipe(map.init())
		.pipe(concat('bem.js'))
		.pipe(uglify())
		.pipe(map.write('../sourcemaps'))
		.pipe(size(settings_size))
		.pipe(gulp.dest('src/js/'))
});

gulp.task('libs_js', () => {
	return gulp
		.src([
			'node_modules/jquery/dist/jquery.min.js'
			/* insert here path to libs and plugins js files, like 'node_modules/lib-1/lib-1.js','node_modules/lib-2/lib-2.js'  */
		])
		.pipe(map.init())
		.pipe(concat('libs.min.js'))
		.pipe(uglify())
		.pipe(map.write('../sourcemaps'))
		.pipe(size(settings_size))
		.pipe(gulp.dest('build/js/'))
});

gulp.task('dev_js', () => {
	return gulp
		.src('src/js/**/*.js')
		.pipe(map.init())
		.pipe(uglify())
		.pipe(concat('main.min.js'))
		.pipe(map.write('../sourcemaps'))
		.pipe(size(settings_size))
		.pipe(gulp.dest('build/js/'))
		.pipe(bs.stream())
});

gulp.task('build_js', () => {
	return gulp
		.src('src/js/**/*.js')
		.pipe(map.init())
		.pipe(uglify())
		.pipe(babel({
			presets: ['@babel/env']
		}))
		.pipe(concat('main.min.js'))
		.pipe(map.write('../sourcemaps'))
		.pipe(size(settings_size))
		.pipe(gulp.dest('build/js/'))
})

gulp.task('js',
	gulp.series(
		'bem_js',
		'libs_js',
		'dev_js'
	)
);

gulp.task('html', () => {
	return gulp
		.src(['src/**/*.html', '!src/**/_*.html'])
		.pipe(include())
		.pipe(svgInclude({
			selectors: '.include-svg'
		}))
		.pipe(htmlmin({
			collapseWhitespace: true
		}))
		.pipe(size(settings_size))
		.pipe(gulp.dest('build'))
		.pipe(bs.stream())
});

gulp.task('php', () => {
	return gulp
		.src('src/**/*.php')
		.pipe(svgInclude({
			selectors: '.include-svg'
		}))
		.pipe(size(settings_size))
		.pipe(gulp.dest('build/'))
		.pipe(bs.stream())
});

gulp.task('json', function () {
	return gulp
		.src('src/**/*.json')
		.pipe(size(settings_size))
		.pipe(gulp.dest('build/'))
		.pipe(bs.stream())
});

gulp.task('svg2css', () => {
	return gulp
		.src('src/svg/css/**/*.svg')
		.pipe(svgmin(svgmin_plugins))
		.pipe(svgcss({
			fileName: '_svg',
			fileExt: 'scss',
			cssPrefix: '--svg__',
			addSize: false
		}))
		.pipe(gulp.dest('src/scss'))
		.pipe(size(settings_size));
});

gulp.task('svg2sprite', () => {
	return gulp
		.src('src/svg/sprite/**/*.svg')
		.pipe(svgmin(svgmin_plugins))
		.pipe(svgsprite({
			mode: {
				stack: {
					sprite: '../sprite.svg'
				}
			},
		}))
		.pipe(gulp.dest('src/img/'))
		.pipe(size(settings_size))
});

gulp.task('img', () => {
	return gulp
		.src('src/img/**/*.+(png|jpg|jpeg|gif|svg|ico|webp)')
		.pipe(changed('build/img/'))
		.pipe(imagemin([
			recompress({
				loops: 4,
				min: 80,
				max: 100,
				quality: 'high',
				use: [pngquant()],
			}),
			imagemin.gifsicle(),
			imagemin.optipng(),
			imagemin.svgo()
		], ), )
		.pipe(gulp.dest('build/img'))
		.pipe(size(settings_size))
		.pipe(bs.stream())
});

gulp.task('images',
	gulp.parallel(
		'svg2css',
		'svg2sprite',
		'img'
	));

gulp.task('font-woff', () => {
	return gulp
		.src('src/fonts/**/*.ttf')
		.pipe(changed('build/fonts', {
			extension: '.woff',
			hasChanged: changed.compareLastModifiedTime
		}))
		.pipe(ttf2woff())
		.pipe(gulp.dest('build/fonts/'))
});

gulp.task('font-woff2', () => {
	return gulp
		.src('src/fonts/**/*.ttf')
		.pipe(changed('build/fonts', {
			extension: '.woff2',
			hasChanged: changed.compareLastModifiedTime
		}))
		.pipe(ttf2woff2())
		.pipe(gulp.dest('build/fonts/'))
});

gulp.task('font-eot', () => {
	return gulp
		.src('src/fonts/**/*.ttf')
		.pipe(changed('build/fonts', {
			extension: '.eot',
			hasChanged: changed.compareLastModifiedTime
		}))
		.pipe(ttf2eot())
		.pipe(gulp.dest('build/fonts/'))
});

const cb = () => {}

let srcFonts = 'src/scss/_local-fonts.scss';
let appFonts = 'build/fonts/';

gulp.task('fontsgen', (done) => {
	let file_content = fs.readFileSync(srcFonts);

	fs.writeFile(srcFonts, '', cb);
	fs.readdir(appFonts, (err, items) => {
		if (items) {
			let c_fontname;
			for (let i = 0; i < items.length; i++) {
				let fontname = items[i].split('.'),
					fontExt;
				fontExt = fontname[1];
				fontname = fontname[0];
				if (c_fontname != fontname) {
					if (fontExt == 'woff' || fontExt == 'woff2' || fontExt == 'eot') {
						fs.appendFile(srcFonts, `@include font-face("${fontname}", "${fontname}", 400);\r\n`, cb);
						console.log(`Added font ${fontname}.
----------------------------------------------------------------------------------
Please, move mixin call from src/scss/_local-fonts.scss to src/scss/_fonts.scss and then change it, if font from this family added ealy!
----------------------------------------------------------------------------------`);
					}
				}
				c_fontname = fontname;
			}
		}
	})
	done();
})

gulp.task('fonts', gulp.series(
	'font-woff2',
	'font-woff',
	'font-eot',
	'fontsgen'
));

gulp.task('server_html', () => {
	bs.init({
		server: {
			baseDir: 'build/',
			host: '192.168.0.104',
		},
		browser: 'chrome',
		logPrefix: 'BS-HTML:',
		logLevel: 'info',
		open: false
	})
});

gulp.task('server_php', () => {
	bs.init({
		browser: ['chrome'],
		watch: true,
		proxy: '',
		/* set local domain of your project */
		logLevel: 'info',
		logPrefix: 'BS-PHP:',
		logConnections: true,
		logFileChanges: true,
	})
});

gulp.task('watch_html', () => {
	gulp.watch('src/scss/**/*.scss', gulp.parallel('dev_styles'));
	gulp.watch('src/components/bem-blocks/**/*.scss', gulp.series('bem_styles', 'dev_styles'));
	gulp.watch('src/**/*.html', gulp.parallel('html'));
	gulp.watch('src/components/bem-blocks/**/*.js', gulp.series('bem_js', 'dev_js'));
	gulp.watch('src/js/**/*.js', gulp.parallel('dev_js'));
	gulp.watch('src/**/*.json', gulp.parallel('json'));
	gulp.watch('src/img/**/*.*', gulp.parallel('img'));
	gulp.watch('src/svg/css/**/*.svg', gulp.parallel('svg2css'));
	gulp.watch('src/svg/sprite/**/*.svg', gulp.parallel('svg2sprite'));
	gulp.watch('src/fonts/**/*.ttf', gulp.parallel('fonts'));
});

gulp.task('watch_php', () => {
	gulp.watch('src/scss/**/*.scss', gulp.parallel('dev_styles'));
	gulp.watch('src/components/bem-blocks/**/*.scss', gulp.series('bem_styles', 'dev_styles'));
	gulp.watch('src/**/*.php', gulp.parallel('php'));
	gulp.watch('src/components/bem-blocks/**/*.js', gulp.series('bem_js', 'dev_js'));
	gulp.watch('src/js/**/*.js', gulp.parallel('dev_js'));
	gulp.watch('src/**/*.json', gulp.parallel('json'));
	gulp.watch('src/img/**/*.*', gulp.parallel('img'));
	gulp.watch('src/svg/css/**/*.svg', gulp.parallel('svg2css'));
	gulp.watch('src/svg/sprite/**/*.svg', gulp.parallel('svg2sprite'));
	gulp.watch('src/fonts/**/*.ttf', gulp.parallel('fonts'));
});

gulp.task('default',
	gulp.parallel(
		'style',
		'html',
		'js',
		'json',
		'images',
		'fonts',
		'watch_html',
		'server_html'
	)
);
gulp.task('dev-php',
	gulp.parallel(
		'style',
		'php',
		'js',
		'json',
		'images',
		'fonts',
		'watch_php',
		'server_php'
	)
);