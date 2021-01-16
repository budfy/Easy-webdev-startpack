'use strict';
const execBuffer = require('exec-buffer');
const isJpg = require('is-jpg');
const jpegRecompress = require('jpeg-recompress-bin');

module.exports = options => buf => {
	options = {...options};

	if (!Buffer.isBuffer(buf)) {
		return Promise.reject(new TypeError('Expected a buffer'));
	}

	if (!isJpg(buf)) {
		return Promise.resolve(buf);
	}

	const args = ['--quiet'];

	if (options.accurate) {
		args.push('--accurate');
	}

	if (options.quality) {
		args.push('--quality', options.quality);
	}

	if (options.method) {
		args.push('--method', options.method);
	}

	if (options.target) {
		args.push('--target', options.target);
	}

	if (options.min) {
		args.push('--min', options.min);
	}

	if (options.max) {
		args.push('--max', options.max);
	}

	if (options.loops) {
		args.push('--loops', options.loops);
	}

	if (options.defish) {
		args.push('--defish', options.defish);
	}

	if (options.zoom) {
		args.push('--zoom', options.zoom);
	}

	if (options.progressive === false) {
		args.push('--no-progressive');
	}

	if (options.subsample) {
		args.push('--subsample', options.subsample);
	}

	if (options.strip !== false) {
		args.push('--strip');
	}

	args.push(execBuffer.input, execBuffer.output);

	return execBuffer({
		input: buf,
		bin: jpegRecompress,
		args
	}).catch(error => {
		error.message = error.stderr || error.message;
		throw error;
	});
};
