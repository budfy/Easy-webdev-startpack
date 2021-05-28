const {
	src,
	dest
} = require('gulp');
const svgmin = require('gulp-svgmin');
const svgCss = require('gulp-svg-css-pseudo');
const size = require('gulp-size');

module.exports = function svg_css() {
	return src('src/svg/css/**/*.svg')
		.pipe(svgmin({
			plugins: [{
					removeComments: true
				},
				{
					removeEmptyContainers: true
				}
			]
		}))
		.pipe(svgCss({
			fileName: 'svg',
			fileExt: 'scss',
			cssPrefix: '--svg__',
			addSize: false
		}))
		.pipe(size({
			'gzip': true,
			'pretty': true,
			'showFiles': true,
			'showTotal': true
		}))
		.pipe(dest('src/scss/global'))
}