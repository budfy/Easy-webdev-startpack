gulp-sass-bulk-importer
=======================

> **NOTE:**  
> Forked from [mathisonian/gulp-sass-bulk-import](https://github.com/mathisonian/gulp-sass-bulk-import) to upgrade the underlying dependencies.
> 
> This upgrade changes the minimum node version needed, from 0.10 to **8.X**.

[![npm version](https://badge.fury.io/js/gulp-sass-bulk-importer.svg)](https://badge.fury.io/js/gulp-sass-bulk-importer)

gulp task to allow importing directories in your SCSS

## installation

```
npm install --save-dev gulp-sass-bulk-importer
```


## usage


#### in your .scss file

```scss

@import "some/path/*";

// becomes
// @import "some/path/file1.scss";
// @import "some/path/file2.scss";
// ...

```

#### in your gulpfile

```js
var bulkSass = require('gulp-sass-bulk-importer');

gulp.task('css', function() {
    return gulp
            .src(srcDir + 'stylesheets/app.scss')
            .pipe(bulkSass())
            .pipe(
                sass({
                    includePaths: ['src/stylesheets']
                }))
            .pipe( gulp.dest('./public/css/') );
});
```
