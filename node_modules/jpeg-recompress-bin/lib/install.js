'use strict';
const path = require('path');
const binBuild = require('bin-build');
const log = require('logalot');
const bin = require('.');

bin.run(['--version']).then(() => {
	log.success('jpeg-recompress pre-build test passed successfully');
}).catch(async error => {
	log.warn(error.message);
	log.warn('jpeg-recompress pre-build test failed');

	if (process.platform === 'win32' || process.platform === 'linux') {
		// eslint-disable-next-line unicorn/no-process-exit
		process.exit(1);
	}

	log.info('compiling from source');

	try {
		await binBuild.file(path.resolve(__dirname, '../vendor/source/jpeg-archive-2.2.0.tar.gz'), [
			`mkdir -p ${bin.dest()}`,
			`make && mv ${bin.use()} ${bin.path()}`
		]);

		log.success('jpeg-recompress built successfully');
	} catch (error) {
		log.error(error.stack);

		// eslint-disable-next-line unicorn/no-process-exit
		process.exit(1);
	}
});
