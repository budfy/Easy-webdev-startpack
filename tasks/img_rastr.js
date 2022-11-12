const {
	src,
	dest
} = require('gulp');
const changed = require('gulp-changed'); // понадобится нам для отслеживания изменения в файле. Если файл не изменился, дальнейшие действия с ним не производятся.
const imagemin = require('gulp-imagemin'); // сжимает изображения
const recompress = require('imagemin-jpeg-recompress'); // тоже сжимает изображения
const pngquant = require('imagemin-pngquant'); // и этот тоже сжимает изображения
const bs = require('browser-sync');

module.exports = function img_rastr() {
	return src('src/img/**/*.+(png|jpg|jpeg|gif|svg|ico)')
		.pipe(changed('build/img'))
		.pipe(imagemin({
				interlaced: true,
				progressive: true,
				optimizationLevel: 5,
			},
			[
				recompress({
					loops: 6,
					min: 50,
					max: 90,
					quality: 'high',
					use: [pngquant({
						quality: [0.8, 1],
						strip: true,
						speed: 1
					})],
				}),
				imagemin.gifsicle(),
				imagemin.optipng(),
				imagemin.svgo()
			], ), )
		.pipe(dest('build/img'))
  	// .pipe(bs.stream())
}
