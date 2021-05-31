const bs = require('browser-sync');

module.exports = function bs_php() {
	bs.init({
		browser: ['chrome'],
		watch: true,
		proxy: '',
		logLevel: 'info',
		logPrefix: 'BS-PHP:',
		logConnections: true,
		logFileChanges: true,
	})
}