"use strict";

//NOTE: определим переменные для функцийи плагинов
let gulp = require("gulp"),
	sass = require("gulp-sass"), //препроцессор
	cssmin = require("gulp-cssmin"), //минификатор CSS
	cleancss = require("gulp-clean-css"),
	prefixer = require("gulp-autoprefixer"), //автоматическая расстановка вендорных префиксов
	babel = require("gulp-babel"), //переводит js-файлы в формат, понятный даже тупому ослику(IE)ю Если точнее, конвертирует javascript стандарта ES6 в ES5
	include = require("gulp-file-include"), //импорт одних файлов в другие (работает с HTML, SCSS/CSS и JS, но нужен он нам в основном для импорта HTML)
	browserSync = require("browser-sync"), //сервер для отображения в браузере в режиме реального времени
	rename = require("gulp-rename"), //переименовывает файлы, добавляет им префиксы и суффиксы
	imagemin = require("gulp-imagemin"), //пережимает изображения
	recompress = require("imagemin-jpeg-recompress"), //тоже пережимает, но лучше. Плагин для плагина
	pngquant = require("imagemin-pngquant"),
	uglify = require("gulp-uglify-es").default, //то же, что cssmin, только для js
	concat = require("gulp-concat"), //склеивает css и js-файлы в один
	del = require("del"), //удаляет указанные файлы и директории. Нужен для очистки перед билдом
	ttfwoff = require("gulp-ttf2woff"), //конвертирует шрифты в веб-формат
	ttfwoff2 = require("gulp-ttftowoff2"), //конвертирует шрифты в веб-формат
	ttf2eot = require("gulp-ttf2eot"), //конвертирует шрифты в веб-формат
	size = require("gulp-filesize"), //выводит в консоль размер файлов до и после их сжатия, чем создаёт чувство глубокого морального удовлетворения, особенно при минификации картинок
	sourcemaps = require("gulp-sourcemaps"), //рисует карту слитого воедино файла, чтобы было понятно, что из какого файла бралось
	svgMin = require("gulp-svgmin"),
	svgCss = require("gulp-svg-css"),
	svgSprite = require("gulp-svg-sprite"),
	fs = require('fs'),
	ver = require("gulp-file-version");

// NOTE: gulp scss task

gulp.task("scss", function () {
	//делаем из своего scss-кода css для браузера
	return gulp
		.src("src/scss/**/*.scss") //берём все файлы в директории scss и директорий нижнего уровня
		.pipe(sourcemaps.init()) //инициализируем sourcemaps, чтобы он начинал записывать, что из какого файла берётся
		.pipe(
			sass({
				outputStyle: "compressed",
			}),
		) //конвертируем scss в css и импортируем все импорты
		.pipe(
			rename({
				suffix: ".min",
			}),
		) //переименовываем файл, чтобы было понятно, что он минифицирован
		.pipe(
			prefixer({
				//добавляем вендорные префиксы
				overrideBrowserslist: ["last 8 versions"], //последние 8 версий, но можно донастроить на большее или меньшее значение
				browsers: [
					//список поддерживаемых браузеров и их версия - ВНИМАНИЕ! данная опция влияет только на расстановку префиксов и не гарантирут 100% работы сайта в этих браузерах.
					"Android >= 4",
					"Chrome >= 20",
					"Firefox >= 24",
					"Explorer >= 11",
					"iOS >= 6",
					"Opera >= 12",
					"Safari >= 6",
				],
			}),
		)
		.pipe(
			cleancss({
				compatibility: "ie8",
				level: {
					1: {
						specialComments: 0,
						removeEmpty: true,
						removeWhitespace: true,
					},
					2: {
						mergeMedia: true,
						removeEmpty: true,
						removeDuplicateFontRules: true,
						removeDuplicateMediaBlocks: true,
						removeDuplicateRules: true,
						removeUnusedAtRules: true,
					},
				},
			}),
		)
		.pipe(sourcemaps.write('sourcemaps/')) //записываем карту в итоговый файл
		.pipe(gulp.dest("build/css")) //кладём итоговый файл в директорию build/css
		.pipe(size()); //смотрим размер получившегося файла
});

//Далее будут похожие или полностью аналогичные функции, которые нет смысла расписывать. Смотрите по аналогии с вышеописанными.

// NOTE: css libs task

gulp.task("style", function () {
	//создаём единую библиотеку из css-стилей всех плагинов
	return gulp
		.src([
			//указываем, где брать исходники
			"node_modules/normalize.css/normalize.css",
		])
		.pipe(concat("libs.min.css")) //склеиваем их в один файл с указанным именем
		.pipe(cssmin()) //минифицируем полученный файл
		.pipe(ver(/templateUrl:["']{1}([\w./-]*)["']{1}/g, {
			base: "./",
			Hash: "md5"
		}))
		.pipe(gulp.dest("build/css")) //кидаем готовый файл в директорию
		.pipe(size());
});

// NOTE: js libs task

gulp.task("script", function () {
	//аналогично поступаем с js-файлами
	return gulp
		.src([
			//тут подключаем разные js в общую библиотеку. Отключите то, что вам не нужно.
			"node_modules/jquery/dist/jquery.js"
		])
		.pipe(size())
		.pipe(babel())
		.pipe(concat("libs.min.js"))
		.pipe(uglify())
		.pipe(gulp.dest("build/js"))
		.pipe(size());
});

// NOTE: js minification task

gulp.task("minjs", function () {
	//минифицируем наш main.js и перекидываем в директорию build
	return gulp
		.src("src/js/*.js")
		.pipe(size())
		.pipe(uglify())
		.pipe(babel())
		.pipe(
			rename({
				suffix: ".min",
			}),
		)
		.pipe(gulp.dest("build/js"))
		.pipe(size());
});

// NOTE: html files include task

gulp.task("html", function () {
	//собираем html из кусочков
	return gulp
		.src(["src/**/*.html", "!src/components/**/*.html"])
		.pipe(
			include({
				//импортируем файлы с префиксом @@. ПРефикс можно настроить под себя.
				prefix: "@@",
				basepath: "@file",
			}),
		)
		.pipe(gulp.dest("build/"))
		.pipe(size())
});

// NOTE: fonts tasks

gulp.task("font-woff", function () {
	return gulp
		.src("src/fonts/**/*.+(eot|svg|ttf|otf|woff|woff2)")
		.pipe(ttfwoff())
		.pipe(gulp.dest("build/fonts/"))
});

gulp.task("font-woff2", function () {
	return gulp
		.src("src/fonts/**/*.+(eot|svg|ttf|otf|woff|woff2)")
		.pipe(ttfwoff2())
		.pipe(gulp.dest("build/fonts/"))
});

gulp.task("font-eot", function () {
	return gulp
		.src("src/fonts/**/*.+(eot|svg|ttf|otf|woff|woff2)")
		.pipe(ttf2eot())
		.pipe(gulp.dest("build/fonts/"))
});

const cb = () => {}

let srcFonts = './src/scss/_local-fonts.scss';
let appFonts = './build/fonts/';

gulp.task("fontsgen", function (done) {
	let file_content = fs.readFileSync(srcFonts);

	fs.writeFile(srcFonts, '', cb);
	fs.readdir(appFonts, function (err, items) {
		if (items) {
			let c_fontname;
			for (var i = 0; i < items.length; i++) {
				let fontname = items[i].split('.'),
					fontExt;
				fontExt = fontname[1];
				fontname = fontname[0];
				if (c_fontname != fontname) {
					if (fontExt == "woff" || fontExt == "woff2" || fontExt == "eot") {
						fs.appendFile(srcFonts, '@include font-face("' + fontname + '", "' + fontname + '", 400);\r\n', cb);
						console.log(`Added font ${fontname}.
----------------------------------------------------------------------------------
Please, move mixin call from src/scss/_local-fonts.scss to src/scss/_fonts.scss and change it, if font from this family added ealy!
----------------------------------------------------------------------------------`);
					}
				}
				c_fontname = fontname;
			}
		}
	})
	done();
})

gulp.task("fonts", gulp.series(
	"font-woff2",
	"font-woff",
	"font-eot",
	"fontsgen"
));

// NOTE: images task

gulp.task("images", function () {
	//пережимаем изображения и складываем их в директорию build
	return gulp
		.src(["src/img/**/*.+(png|jpg|jpeg|gif|svg|ico|webp)", "!src/img/svg-to-css, !src/img/svg-to-sprite"])
		.pipe(size())
		.pipe(
			imagemin(
				[
					recompress({
						//Настройки сжатия изображений. Сейчас всё настроено так, что сжатие почти незаметно для глаза на обычных экранах. Можете покрутить настройки, но за результат не отвечаю.
						loops: 4, //количество прогонок изображения
						min: 80, //минимальное качество в процентах
						max: 100, //максимальное качество в процентах
						quality: "high", //тут всё говорит само за себя, если хоть капельку понимаешь английский
						use: [pngquant()],
					}),
					imagemin.gifsicle(), //тут и ниже всякие плагины для обработки разных типов изображений
					imagemin.optipng(),
					imagemin.svgo(),
				],
			),
		)
		.pipe(gulp.dest("build/img"))
		.pipe(size())
});

// NOTE: svg tasks
gulp.task("svgCss", function () {
	return gulp
		.src("src/img/svg-to-css/**/*.svg")
		.pipe(size())
		.pipe(svgMin())
		.pipe(svgCss({
			fileName: '_svg',
			fileExt: 'scss',
			cssPrefix: '--svg__',
			addSize: false
		}))
		.pipe(ver(/templateUrl:["']{1}([\w./-]*)["']{1}/g, {
			base: "./",
			Hash: "md5"
		}))
		.pipe(gulp.dest('src/scss'))
		.pipe(size());
});

gulp.task("svgSprite", function () {
	return gulp
		.src("src/img/svg-to-sprite/**/*.svg")
		.pipe(svgMin({
			plugins: [{
					removeComments: true
				},
				{
					removeEmptyContainers: true
				}
			]
		}))
		.pipe(svgSprite({
			mode: {
				stack: {
					sprite: "../sprite.svg" //sprite file name
				}
			},
		}))
		.pipe(gulp.dest('src/img/'))
		.pipe(size())
});

gulp.task("img", gulp.series(
	"svgCss",
	"svgSprite",
	"images"
))

gulp.task("deletefonts", function () {
	//задачи для очистки директории со шрифтами в build. Нужна для того, чтобы удалить лишнее.
	return del.sync("build/fonts/**/*.*");
});

gulp.task("deleteimg", function () {
	//аналогично предыдущей, но с картинками.
	return del.sync("build/img/**/*.*");
});

gulp.task("jSon", function () {
	return gulp
		.src("src/js/json/**/*.*")
		.pipe(size())
		.pipe(ver(/templateUrl:["']{1}([\w./-]*)["']{1}/g, {
			base: "./",
			Hash: "md5"
		}))
		.pipe(gulp.dest("build/js/json/"))
		.pipe(size())
});

gulp.task("php", function () {
	return gulp
		.src("src/**/*.php")
		.pipe(
			include({
				prefix: "@@",
				basepath: "@file",
			}),
		)
		.pipe(ver(/templateUrl:["']{1}([\w./-]*)["']{1}/g, {
			base: "./",
			Hash: "md5"
		}))
		.pipe(gulp.dest("build/"))
		.pipe(size())
});

gulp.task("browser-sync", function () {
	//настройки лайв-сервера
	browserSync.init({
		server: {
			baseDir: "build/", //какую папку показывать в браузере
		},
		browser: ["chrome"], //в каком браузере
		//tunnel: " ", //тут можно прописать название проекта и дать доступ к нему через интернет. Работает нестабильно, запускается через раз. Не рекомендуется включать без необходимости.
		//tunnel:true, //работает, как и предыдущяя опция, но присваивает рандомное имя. Тоже запускается через раз и поэтому не рекомендуется для включения
		host: "192.168.0.104", //IP сервера в локальной сети. Отключите, если у вас DHCP, пропишите под себя, если фиксированный IP в локалке.
		logLevel: "info",
		logPrefix: "browserSync",
		logConnections: true,
		logFileChanges: true,
		open: true,
		timestamps: true
	})
});

gulp.task("browser-sync-php", function () {
	browserSync.init({
		browser: ["chrome"],
		watch: true,
		proxy: "", //тут пишем длокальный домен, заданный в алиасах OpenServer
		logLevel: "info",
		logPrefix: "browserSync",
		logConnections: true,
		logFileChanges: true,
		open: true,
		timestamps: true
	})
});

gulp.task("bs-reload", function () {
	browserSync.reload();
})

gulp.task("watch", function () {
	//Следим за изменениями в файлах и директориях и запускаем задачи, если эти изменения произошли
	gulp.watch(
		"src/fonts/**/*.*",
		gulp.parallel("fonts"),
	);
	gulp.watch("src/js/**/*.js", gulp.parallel("minjs", "bs-reload"));
	gulp.watch("src/img/svg-to-css/**/*.*", gulp.parallel("svgCss", "bs-reload"));
	gulp.watch("src/img/svg-to-sprite/**/*.*", gulp.series("svgSprite", "images", "bs-reload"));
	gulp.watch("src/js/json/**/*.*", gulp.parallel("jSon", "bs-reload"));
	gulp.watch("src/scss/**/*.scss", gulp.parallel("scss", "bs-reload"));
	gulp.watch("src/**/*.html", gulp.parallel("html", "bs-reload"));
});

gulp.task("watch-php", function () {
	//Следим за изменениями в файлах и директориях и запускаем задачи, если эти изменения произошли
	gulp.watch(
		"src/fonts/**/*.*",
		gulp.parallel("fonts"),
	);
	gulp.watch("src/js/**/*.js", gulp.parallel("minjs", "bs-reload"));
	gulp.watch("src/img/svg-to-css/**/*.*", gulp.parallel("svgCss", "bs-reload"));
	gulp.watch("src/img/svg-to-sprite/**/*.*", gulp.series("svgSprite", "images", "bs-reload"));
	gulp.watch("src/js/json/**/*.*", gulp.parallel("jSon", "bs-reload"));
	gulp.watch("src/**/*.php", gulp.parallel("php", "bs-reload"));
	gulp.watch("src/scss/**/*.scss", gulp.parallel("scss", "bs-reload"));
});

gulp.task(
	"default",
	gulp.parallel(
		"browser-sync",
		"watch",
		"scss",
		"style",
		"script",
		"minjs",
		"html",
		"fonts",
		"img",
		"jSon"
	)); //запускает все перечисленные задачи разом

gulp.task(
	"php",
	gulp.parallel(
		"browser-sync-php",
		"watch-php",
		"scss",
		"style",
		"script",
		"minjs",
		"fonts",
		"img",
		"jSon",
		"php"
	)); //запускает все перечисленные задачи разом

gulp.task(
	"build",
	gulp.parallel(
		"scss",
		"style",
		"script",
		"minjs",
		"html",
		"fonts",
		"img",
		"jSon",
		"php"
	)); //запускает задачи для сборки проекта в build без запуска сервера