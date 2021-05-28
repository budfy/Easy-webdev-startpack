const {
	src,
	dest
} = require('gulp');
const svgmin = require('gulp-svgmin');
const sprite = require('gulp-svg-sprite');
const size = require('gulp-size');

module.exports = function svg_sprite() {
	return src('src/svg/**/*.svg')
		.pipe(svgmin({
			plugins: [{
					removeComments: true
				},
				{
					removeEmptyContainers: true
				}
			]
		}))
		.pipe(sprite({
			mode: {
				stack: {
					sprite: '../sprite.svg'
				}
			}
		}))
		.pipe(size({
			'gzip': true,
			'pretty': true,
			'showFiles': true,
			'showTotal': true
		}))
		.pipe(dest('src/img'))
}