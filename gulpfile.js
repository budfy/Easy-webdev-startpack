/** @format */

"use strict";

//определим переменные для функцийи плагинов
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
	uglify = require("gulp-uglify"), //то же, что cssmin, только для js
	concat = require("gulp-concat"), //склеивает css и js-файлы в один
	del = require("del"), //удаляет указанные файлы и директории. Нужен для очистки перед билдом
	ttf2woff = require("gulp-ttf2woff"), //конвертирует шрифты в веб-формат
	ttf2woff2 = require("gulp-ttf2woff2"), //конвертирует шрифты в веб-формат
	ttf2eot = require("gulp-ttf2eot"), //конвертирует шрифты в веб-формат
	size = require("gulp-filesize"), //выводит в консоль размер файлов до и после их сжатия, чем создаёт чувство глубокого морального удовлетворения, особенно при минификации картинок
	rsync = require("gulp-rsync"), //заливает файлы проекта на хостинг по ftp с заданными параметрами
	sourcemaps = require("gulp-sourcemaps"); //рисует карту слитого воедино файла, чтобы было понятно, что из какого файла бралось

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
						removeUnusedAtRules: false,
					},
				},
			}),
		)
		.pipe(sourcemaps.write()) //записываем карту в итоговый файл
		.pipe(gulp.dest("build/css")) //кладём итоговый файл в директорию build/css
		.pipe(
			browserSync.reload({
				stream: true,
			}),
		) //обновляем браузер
		.pipe(size()); //смотрим размер получившегося файла
});

//Далее будут похожие или полностью аналогичные функции, которые нет смысла расписывать. Смотрите по аналогии с вышеописанными.

gulp.task("style", function () {
	//создаём единую библиотеку из css-стилей всех плагинов
	return gulp
		.src([
			//указываем, где брать исходники
			"node_modules/normalize.css/normalize.css",
		])
		.pipe(sourcemaps.init())
		.pipe(concat("libs.min.css")) //склеиваем их в один файл с указанным именем
		.pipe(cssmin()) //минифицируем полученный файл
		.pipe(sourcemaps.write())
		.pipe(gulp.dest("build/css")) //кидаем готовый файл в директорию
		.pipe(size());
});

gulp.task("script", function () {
	//аналогично поступаем с js-файлами
	return gulp
		.src([
			//тут подключаем разные js в общую библиотеку. Отключите то, что вам не нужно.
			"node_modules/jquery/dist/jquery.js",
		])
		.pipe(size())
		.pipe(sourcemaps.init())
		.pipe(babel())
		.pipe(concat("libs.min.js"))
		.pipe(uglify())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest("build/js"))
		.pipe(size());
});

gulp.task("minjs", function () {
	//минифицируем наш main.js и перекидываем в директорию build
	return gulp
		.src("src/js/main.js")
		.pipe(size())
		.pipe(babel())
		.pipe(uglify())
		.pipe(
			rename({
				suffix: ".min",
			}),
		)
		.pipe(gulp.dest("build/js"))
		.pipe(size());
});

gulp.task("js", function () {
	//обновляем браузер, если в наших js файлах что-то поменялось
	return gulp.src("src/js/**/*.js").pipe(
		browserSync.reload({
			stream: true,
		}),
	);
});

gulp.task("html", function () {
	//собираем html из кусочков
	return gulp
		.src(["src/**/*.html", "!src/components/**/*.html"])
		.pipe(sourcemaps.init())
		.pipe(
			include({
				//импортируем файлы с префиксом @@. ПРефикс можно настроить под себя.
				prefix: "@@",
				basepath: "@file",
			}),
		)
		.pipe(sourcemaps.write())
		.pipe(gulp.dest("build/"))
		.pipe(size())
		.pipe(
			browserSync.reload({
				stream: true,
			}),
		);
});

gulp.task("font-woff", function () {
	//перекидываем шрифты из директории src в build, а заодно следим за новыми файлами, чтобы обновлять браузер, когда появляется шрифт
	return gulp
		.src("src/fonts/**/*.+(eot|svg|ttf|otf|woff|woff2)")
		.pipe(ttf2woff())
		.pipe(gulp.dest("build/fonts/"))
		.pipe(
			browserSync.reload({
				stream: true,
			}),
		);
});

gulp.task("font-woff2", function () {
	//перекидываем шрифты из директории src в build, а заодно следим за новыми файлами, чтобы обновлять браузер, когда появляется шрифт
	return gulp
		.src("src/fonts/**/*.+(eot|svg|ttf|otf|woff|woff2)")
		.pipe(ttf2woff2())
		.pipe(gulp.dest("build/fonts/"))
		.pipe(
			browserSync.reload({
				stream: true,
			}),
		);
});

gulp.task("font-eot", function () {
	//перекидываем шрифты из директории src в build, а заодно следим за новыми файлами, чтобы обновлять браузер, когда появляется шрифт
	return gulp
		.src("src/fonts/**/*.+(eot|svg|ttf|otf|woff|woff2)")
		.pipe(ttf2eot())
		.pipe(gulp.dest("build/fonts/"))
		.pipe(
			browserSync.reload({
				stream: true,
			}),
		);
});

// gulp.task('favicons', function(){ //генератор favicon для всех устройств. Запускается вручную отдельной командой. Генерирует фавиконки на все случаи жизни и файл favicons.html, в котором находятся подключения этих иконок. Скопируйте подключения в файлы проекта и удалите favicons.html Больше нужно для веб-приложений, потому что их ярлыки выносят на главный экран. Сайтам же достаточно закинуть и подключить одну favicon.ico Короче, если вы не уверены, что большинство пользователей мобильных устройств запихнут ярлык вашего сайта на главный экран и разрешат push-уведомления в телефоне, ваша фамилия не Цукерберг и не Дуров - вам этот таск, скорее всего не нужен.
//   return gulp.src('src/img/favicon/favicon.png')
//   .pipe(favgen({
//     appName: 'My App',
//     appShortName: 'App',
//     appDescription: 'This is my application',
//     developerName: 'Hayden Bleasel',
//     developerURL: 'http://haydenbleasel.com/',
//     background: '#020307',
//     path: 'favicons/',
//     url: 'http://haydenbleasel.com/',
//     display: 'standalone',
//     orientation: 'portrait',
//     scope: '/',
//     start_url: '/?homescreen=1',
//     version: 1.0,
//     logging: false,
//     html: 'favicons.html',
//     pipeHTML: true,
//     replace: true,
//   })
//   )
//   .pipe(gulp.dest('src/'))
// });

gulp.task("images", function () {
	//пережимаем изображения и складываем их в директорию build
	return gulp
		.src("src/img/**/*.+(png|jpg|jpeg|gif|svg|ico)")
		.pipe(size())
		.pipe(
			imagemin([
				recompress({
					//Настройки сжатия изображений. Сейчас всё настроено так, что сжатие почти незаметно для глаза на обычных экранах. Можете покрутить настройки, но за результат не отвечаю.
					loops: 4, //количество прогонок изображения
					min: 70, //минимальное качество в процентах
					max: 80, //максимальное качество в процентах
					quality: "high", //тут всё говорит само за себя, если хоть капельку понимаешь английский
				}),
				imagemin.gifsicle(), //тут и ниже всякие плагины для обработки разных типов изображений
				imagemin.optipng(),
				imagemin.svgo(),
			]),
		)
		.pipe(gulp.dest("build/img"))
		.pipe(
			browserSync.reload({
				stream: true,
			}),
		)
		.pipe(size());
});

gulp.task("deletefonts", function () {
	//задачи для очистки директории со шрифтами в build. Нужна для того, чтобы удалить лишнее.
	return del.sync("build/fonts/**/*.*");
});

gulp.task("deleteimg", function () {
	//аналогично предыдущей, но с картинками.
	return del.sync("build/img/**/*.*");
});

gulp.task("watch", function () {
	//Следим за изменениями в файлах и директориях и запускаем задачи, если эти изменения произошли
	gulp.watch("src/scss/**/*.scss", gulp.parallel("scss"));
	gulp.watch("src/**/*.html", gulp.parallel("html"));
	gulp.watch(
		"src/fonts/**/*.*",
		gulp.parallel("font-woff", "font-woff2", "font-eot"),
	);
	gulp.watch("src/js/**/*.js", gulp.parallel("minjs", "js"));
	gulp.watch("src/img/**/*.*", gulp.parallel("images"));
});

gulp.task("deploy", function () {
	//грузим файлы на хостинг по FTP
	return gulp.src("build/**").pipe(
		rsync({
			root: "build/", //откуда берём файлы
			hostname: "yourLogin@yourIp", //ваш логин на хостинге@IPхостинга
			destination: "sitePath", //папка, в которую будем загружать
			//port: 25212, //порт, к которому пойдёт подключение. Нужна, если нестандартный порт
			include: ["*.htaccess"], //файлы, которые нужно включить в передачу
			exclude: ["**/Thumbs.db", "**/*.DS_Store"], //файлы, которые нужно исключить из передачи
			recursive: true, //передавать все файлы и папки рекурсивно
			archive: true, //режим архива
			silent: false, //отключим ведение журнала
			compress: true, //включим сжатие
			progress: true, //выведем прогресс передачи в консоль
		}),
	);
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
	});
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
		"font-woff",
		"font-eot",
		"font-woff2",
		"images",
	),
); //запускает все перечисленные задачи разом
