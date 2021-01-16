#!/usr/bin/env node
'use strict';
const {spawn} = require('child_process');
const jpegRecompress = require('.');

const input = process.argv.slice(2);

spawn(jpegRecompress, input, {stdio: 'inherit'})
	.on('exit', process.exit);
