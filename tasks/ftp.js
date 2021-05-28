const {
	src
} = require('gulp');
const ftp = require('vinyl-ftp');
const ftpSettings = require('../tasks/ftp_settings');
const chalk = require('chalk');
const size = require('gulp-size');
const connect = ftp.create(ftpSettings);

module.exports = function ftp() {
	return src('build/**/*.*')
		.pipe(connect.newer('www/'))
		.pipe(size({
			'gzip': true,
			'pretty': true,
			'showFiles': true,
			'showTotal': true
		}))
		.pipe(connect.dest('www/'))
		.on('success', () => console.log(`Finished deploing ./build to https://${chalk.blueBright(ftpSettings.host)}`))
}