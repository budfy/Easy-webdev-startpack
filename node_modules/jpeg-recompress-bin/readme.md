# jpeg-recompress-bin [![Build Status](https://travis-ci.org/imagemin/jpeg-recompress-bin.svg?branch=master)](https://travis-ci.org/imagemin/jpeg-recompress-bin)

> Compress JPEGs by re-encoding to the smallest JPEG quality while keeping perceived visual quality the same and by making sure huffman tables are optimized

You probably want [`imagemin-jpeg-recompress`](https://github.com/imagemin/imagemin-jpeg-recompress) instead.


## Install

```
$ npm install --save jpeg-recompress-bin
```


## Usage

```js
const {execFile} = require('child_process');
const jpegRecompress = require('jpeg-recompress-bin');

execFile(jpegRecompress, ['--quality high', '--min 60', 'input.jpg', 'output.jpg'], err => {
	console.log('Image minified');
});
```


## CLI

```
$ npm install --global jpeg-recompress-bin
```

```
$ jpeg-recompress --help
```


## License

MIT © [Imagemin](https://github.com/imagemin)
