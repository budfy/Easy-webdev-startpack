const {
	src
} = require('gulp');
const ftp = require('vinyl-ftp');
const ftpSettings = require('../tasks/ftp_settings.json');
const chalk = require('chalk');
const connect = ftp.create(ftpSettings);

module.exports = function deploy() {
	return src(['build/**/*.*', '!build/**/*.map'])
		.pipe(connect.newer('public_html/'))
		.pipe(connect.dest('/domains/plotnik-web.ru/portfolio'))
		.on('success', () => console.log(`Finished deploing ./build to https://${chalk.blueBright(ftpSettings.host)}`))
}
