'use strict';
const path = require('path');
const BinWrapper = require('bin-wrapper');
const pkg = require('../package.json');

const url = `https://raw.github.com/imagemin/jpeg-recompress-bin/v${pkg.version}/vendor/`;

module.exports = new BinWrapper()
	.src(`${url}osx/jpeg-recompress`, 'darwin')
	.src(`${url}linux/jpeg-recompress`, 'linux')
	.src(`${url}win/jpeg-recompress.exe`, 'win32')
	.dest(path.resolve(__dirname, '../vendor'))
	.use(process.platform === 'win32' ? 'jpeg-recompress.exe' : 'jpeg-recompress');
