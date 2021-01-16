# [gulp][gulp]-svgmin [![Build Status](https://travis-ci.org/ben-eb/gulp-svgmin.svg?branch=master)][ci] [![NPM version](https://badge.fury.io/js/gulp-svgmin.svg)][npm] [![Dependency Status](https://gemnasium.com/ben-eb/gulp-svgmin.svg)][deps]

> Minify SVG with [SVGO][orig].

*If you have any difficulties with the output of this plugin, please use the
[SVGO tracker][bugs].*


## Install

With [npm](https://npmjs.org/package/gulp-svgmin) do:

```
npm install gulp-svgmin
```


## Example

```js
var gulp = require('gulp');
var svgmin = require('gulp-svgmin');

gulp.task('default', function () {
    return gulp.src('logo.svg')
        .pipe(svgmin())
        .pipe(gulp.dest('./out'));
});
```


## Plugins

Optionally, you can customise the output by specifying the `plugins` option. You
will need to provide the config in comma separated objects, like the example
below. Note that you can either disable the plugin by setting it to false,
or pass different options to change the default behaviour.

```js
gulp.task('default', function () {
    return gulp.src('logo.svg')
        .pipe(svgmin({
            plugins: [{
                removeDoctype: false
            }, {
                removeComments: false
            }, {
                cleanupNumericValues: {
                    floatPrecision: 2
                }
            }, {
                convertColors: {
                    names2hex: false,
                    rgb2hex: false
                }
            }]
        }))
        .pipe(gulp.dest('./out'));
});
```

You can view the [full list of plugins here][plugins].


## Beautify

You can also use `gulp-svgmin` to optimise your SVG but render a pretty output,
instead of the default where all extraneous whitespace is removed:

```js
gulp.task('pretty', function () {
    return gulp.src('logo.svg')
        .pipe(svgmin({
            js2svg: {
                pretty: true
            }
        }))
        .pipe(gulp.dest('./out'))
});
```


## Per-file options

To have per-file options, pass a function, that receives `file` object and
returns `svgo` options. For example, if you need to prefix ids with filenames
to make them unique before combining svgs with [gulp-svgstore](https://github.com/w0rm/gulp-svgstore):

```js
gulp.task('default', function () {
    return gulp.src('src/*.svg')
        .pipe(svgmin(function getOptions (file) {
            var prefix = path.basename(file.relative, path.extname(file.relative));
            return {
                plugins: [{
                    cleanupIDs: {
                        prefix: prefix + '-',
                        minify: true
                    }
                }]
            }
        }))
        .pipe(svgstore())
        .pipe(gulp.dest('./dest'));
});
```


## Contributing

Pull requests are welcome. If you add functionality, then please add unit tests
to cover it.


## License

MIT © [Ben Briggs](http://beneb.info)


[bugs]:    https://github.com/svg/svgo/issues
[ci]:      https://travis-ci.org/ben-eb/gulp-svgmin
[deps]:    https://gemnasium.com/ben-eb/gulp-svgmin
[gulp]:    https://github.com/wearefractal/gulp
[npm]:     http://badge.fury.io/js/gulp-svgmin
[orig]:    https://github.com/svg/svgo
[plugins]: https://github.com/svg/svgo/tree/master/plugins
