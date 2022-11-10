const {
	src
} = require('gulp');
const ftp = require('vinyl-ftp');
const ftpSettings = require('../tasks/ftp_settings');
const chalk = require('chalk');
const connect = ftp.create(ftpSettings);

module.exports = function deploy() {
	return src(['docs/**/*.*', '!docs/**/*.map'])
		.pipe(connect.newer('public_html/'))
		.pipe(connect.dest('public_html/'))
		.on('end', () => console.log(`Finished deploing ./docs to https://${chalk.blueBright(ftpSettings.host)}`))
}