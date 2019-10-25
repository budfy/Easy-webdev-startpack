'use strict';

let gulp = require ('gulp'),
    sass = require('gulp-sass'),
    cssmin = require('gulp-cssmin'),
    prefixer = require('gulp-autoprefixer'),
    include = require('gulp-file-include'),
    browserSync = require('browser-sync'),
    rename = require('gulp-rename'),
    imagemin = require('gulp-imagemin'),
    recompress = require('imagemin-jpeg-recompress'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    del = require('del'),
    sourcemaps = require('gulp-sourcemaps');

    gulp.task('scss', function(){
     return gulp.src('src/scss/**/*.scss')
     .pipe(sourcemaps.init())
     .pipe(sass({outputStyle:'compressed'}))
     .pipe(rename({suffix: '.min'}))
     .pipe(prefixer({
       overrideBrowserslist: ['last 8 versions']
      }))
     .pipe(sourcemaps.write())
     .pipe(gulp.dest('build/css'))
     .pipe(browserSync.reload({stream:true}))
    });

    gulp.task('style', function(){
      return gulp.src([
        'node_modules/normalize.css/normalize.css',
        'node_modules/slick-carousel/slick/slick.css',
        'node_modules/magnific-popup/dist/magnific-popup.css',
      ])
      .pipe(concat('libs.min.css'))
      .pipe(cssmin())
      .pipe(gulp.dest('build/css'))
    });

    gulp.task('script', function(){
      return gulp.src([
        'node_modules/jquery/dist/jquery.js',
        'node_modules/slick-carousel/slick/slick.js',
        'node_modules/mixitup/dist/mixitup.js',
        'node_modules/magnific-popup/dist/jquery.magnific-popup.js',
      ])
      .pipe(concat('libs.min.js'))
      .pipe(uglify())
      .pipe(gulp.dest('build/js'))
    });

    gulp.task('minjs', function(){
      return gulp.src(['src/js/main.js'])
      .pipe(uglify())
      .pipe(rename({suffix: '.min'}))
      .pipe(gulp.dest('build/js')) 
    });

    gulp.task('js', function(){
      return gulp.src('src/js/**/*.js')
      .pipe(browserSync.reload({stream: true})) 
    });
    
    gulp.task('html', function(){
      return gulp.src(['src/**/*.html', '!src/components/**/*.html'])
     .pipe(include({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest('build/'))
    .pipe(browserSync.reload({stream:true}));
    });

    gulp.task('fonts', function(){
      return gulp.src('src/fonts/**/*.+(eot|svg|ttf|woff|woff2)')
      .pipe(gulp.dest('build/fonts'))
      .pipe(browserSync.reload({stream:true}));
    });

    gulp.task('images', function(){
      return gulp.src('src/img/**/*.+(png|jpg|jpeg|gif|svg|ico)')
      .pipe(imagemin([
        recompress({
          loops: 4,
          min: 70,
          max: 80,
          quality: 'high'
        }),
        imagemin.gifsicle(),
        imagemin.optipng(),
        imagemin.svgo()
      ]))
      .pipe(gulp.dest('build/img'))
      .pipe(browserSync.reload({stream:true}));
    });

    gulp.task('deletefonts', function() {
      return del('build/fonts/**/*.*');
    });

    gulp.task('deleteimg', function() {
      return del('build/img/**/*.*');
    });

    gulp.task('cleanfonts', gulp.series('deletefonts', 'fonts'));

    gulp.task('cleanimg', gulp.series('deleteimg', 'images'));
    


    gulp.task('watch', function(){
      gulp.watch('src/scss/**/*.scss', gulp.parallel('scss'));
      gulp.watch('src/**/*.html', gulp.parallel('html'));
      gulp.watch('src/fonts/**/*.*', gulp.parallel('fonts'));
      gulp.watch('src/js/**/*.js', gulp.parallel('minjs', 'js'));
      gulp.watch('src/images/**/*.*', gulp.parallel('images'));
    });



    gulp.task('browser-sync', function() {
      browserSync.init({
          server: {
              baseDir: "build/"
          },
          browser: ["chrome"],
          //tunnel: "moderno",
          host: "192.168.0.103"
      });
    });

    gulp.task('default', gulp.parallel('browser-sync', 'watch', 'scss', 'style', 'script', 'minjs', 'html', 'cleanfonts', 'cleanimg'))