'use strict';
const fancyLog = require('fancy-log');
const PluginError = require('plugin-error');
const through = require('through2');
const chalk = require('chalk');
const prettyBytes = require('pretty-bytes');
const StreamCounter = require('stream-counter');
const gzipSize = require('gzip-size');

module.exports = opts => {
	opts = Object.assign({
		pretty: true,
		showTotal: true
	}, opts);

	let totalSize = 0;
	let fileCount = 0;

	function log(what, size) {
		let title = opts.title;
		title = title ? chalk.cyan(title) + ' ' : '';
		size = opts.pretty ? prettyBytes(size) : (size + ' B');
		fancyLog(title + what + ' ' + chalk.magenta(size) + (opts.gzip ? chalk.gray(' (gzipped)') : ''));
	}

	return through.obj((file, enc, cb) => {
		if (file.isNull()) {
			cb(null, file);
			return;
		}

		const finish = (err, size) => {
			if (err) {
				cb(new PluginError('gulp-size', err));
				return;
			}

			totalSize += size;

			if (opts.showFiles === true && size > 0) {
				log(chalk.blue(file.relative), size);
			}

			fileCount++;
			cb(null, file);
		};

		if (file.isStream()) {
			if (opts.gzip) {
				file.contents.pipe(gzipSize.stream())
					.on('error', finish)
					.on('end', function () {
						finish(null, this.gzipSize);
					});
			} else {
				file.contents.pipe(new StreamCounter())
					.on('error', finish)
					.on('finish', function () {
						finish(null, this.bytes);
					});
			}

			return;
		}

		if (opts.gzip) {
			gzipSize(file.contents).then(size => finish(null, size)).catch(finish);
		} else {
			finish(null, file.contents.length);
		}
	}, function (cb) {
		this.size = totalSize;
		this.prettySize = prettyBytes(totalSize);

		if (!(fileCount === 1 && opts.showFiles) && totalSize > 0 && fileCount > 0 && opts.showTotal) {
			log(chalk.green('all files'), totalSize);
		}

		cb();
	});
};
