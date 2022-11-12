const {
	src,
	dest
} = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const bulk = require('gulp-sass-bulk-importer');
const prefixer = require('gulp-autoprefixer');
const clean = require('gulp-clean-css');
const concat = require('gulp-concat');
const map = require('gulp-sourcemaps');
const bs = require('browser-sync');

module.exports = function style() {
	return src('src/sass/**/*.sass') // определяем источник исходного кода (source)
		.pipe(map.init()) // инициализируем маппинг, чтобы он отслеживал включаемые файлы
		.pipe(bulk()) // проводим код через плагин, который ползволяет использовать директиву @include в sass для директорий, а не только для отдельных файлов
		.pipe(sass({ // проводим код через сам компиллятор sass
		// outputStyle: 'compressed'  // для sass я определяю степень сжатия выходного css как compressed,
			outputStyle: 'expanded' // полностью развёрнутый CSS
		}).on('error', sass.logError)) // а так же добавляю на событие error логирование ошибки, чтобы было понятно, что не так (если вдруг)
		.pipe(prefixer({ // проводим код через префиксер, который расставит вендорные префиксы
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
		.pipe(clean({ // проводим код через "очиститель" от лишнего css
			level: 2
		}))
		.pipe(concat('style.min.css')) // склеиваем все исходные файлы в один
		.pipe(map.write('../sourcemaps/')) // записываем "карту" источников полученного файла
		.pipe(dest('build/css/')) // кладём итоговый файл в директорию
		.pipe(bs.stream())
}
