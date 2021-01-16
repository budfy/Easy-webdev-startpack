# gulp-embed-svg

[![NPM](https://nodei.co/npm/gulp-embed-svg.png?downloads=true)](https://nodei.co/npm/gulp-embed-svg/)

[![npm version](https://badge.fury.io/js/gulp-embed-svg.svg)](http://badge.fury.io/js/gulp-embed-svg)
[![Build Status](https://travis-ci.org/haensl/gulp-embed-svg.svg?branch=master)](https://travis-ci.org/haensl/gulp-embed-svg)

Gulp plugin to inline/embed SVG images into html files.

## Features

* Inline/embed any images with an SVG source attribute (i.e. `<img src="some.svg">`) and `<svg>` tags with a `src` attribute (i.e. `<svg src="some.svg">`).

* Preserves all/select attributes via RegEx.

* Optionally create a spritesheet from the inlined SVGs.

## Installation

```shell
npm i --save-dev gulp-embed-svg
```

## Quick Start

```javascript
const embedSvg = require('gulp-embed-svg');

gulp.task('embedSvgs', () =>
  gulp.src('*.html')
    .pipe(embedSvg())
    .pipe(gulp.dest('dist/')));
```

This gulp task will inline/embed any images with an SVG source attribute (i.e. `<img src="some.svg">`) and `<svg>` tags with a `src` attribute.

## Options

* [`selectors`](#selectors): Provide custom CSS selectors to specify which tags should be replaced by embedded SVGs.
* [`attrs`](#attrs): Provide a regular expression to transfer select attributes from matched tags to embedded `<svg>`s.
* [`decodeEntities`](#decode-entities): Set to `true` to decode HTML entities within the document.
* [`root`](#root): Provide the root folder where SVG source images are located.
* [`createSpritesheet`](#create-spritesheet): Set to `true` to embed SVGs via a spritesheet. This reduces generated HTML filesize if you use the same SVG several times on a page.
* [`spritesheetClass`](#spritesheet-class): Customize the CSS class assigned to the generated spritesheet.
* [`spriteIdFn`](#sprite-id-fn): Customize the `id` assigned to the sprites by providing a function that resolves path and index to a string.

### selectors `string | Array<string>`<a name="selectors"></a>

Provide custom CSS selectors to specify which tags should be replaced by embedded SVGs.

#### default: `['img[src$=".svg"]', 'svg[src$=".svg"]']`

All `<img>` and `<svg>` tags with an svg source.

#### Example: Only embed tags with a specific class

**HTML layout**

```html
<html>
  <head><!-- ... --></head>
  <body>
    <!-- ... -->
    <svg src="github-icon.svg" class="inline-svg"></svg>
    <img src="other-icon.svg" />
    <!-- ... -->
  </body>
</html>
```

**Gulp task**

```javascript
const embedSvg = require('gulp-embed-svg');

gulp.task('embedSvgs', () =>
  gulp.src('*.html')
    .pipe(embedSvg({
      selectors: '.inline-svg' // only replace tags with the class inline-svg
    }))
    .pipe(gulp.dest('dist/')));
```

**Output**

```html
<html>
  <head><!-- ... --></head>
  <body>
    <!-- ... -->
    <svg class="inline-svg"><!-- svg markup from github-icon.svg --></svg>
    <img src="other-icon.svg" />
    <!-- ... -->
  </body>
</html>
```


### attrs `string | RegExp`<a name="attrs"></a>

Provide a regular expression to transfer select attributes from matched tags to embedded `<svg>`s.

**Attention:** Attributes from matched tags take precedence over corresponding attributes in the source `.svg` file.

#### default: `^(?!src).*$`

Transfer/preserve any attribute **but** `src`.

#### Example: Preserve/transfer specific attribute

**HTML layout**

```html
<html>
<head><!-- ... --></head>
<body>
  <!-- ... -->
  <svg src="github-icon.svg" class="icon"></svg>
  <!-- ... -->
</body>
</html>
```

**Gulp task**

```javascript
const embedSvg = require('gulp-embed-svg');

gulp.task('embedSvgs', () =>
  gulp.src('*.html')
    .pipe(embedSvg({
      attrs: /class/ // only transfer/preserve class attribute
    }))
    .pipe(gulp.dest('dist/')));
```

**Output**

```html
<html>
  <head><!-- ... --></head>
  <body>
    <!-- ... -->
    <svg class="icon"><!-- svg markup from github-icon.svg --></svg>
    <!-- ... -->
  </body>
</html>
```

### decodeEntities `boolean`<a name="decode-entities"></a>

Set to `true` to decode HTML entities within the document.

#### default: `false`

##### Example: Replace potential entities in document with html entities

**HTML layout**

```html
<html>
  <head><!-- ... --></head>
  <body>
    <!-- ... -->
    <span>Foo © bar 𝌆 baz ☃ qux</span>
    <svg src="github-icon.svg"></svg>
    <!-- ... -->
  </body>
</html>
```

**Gulp task**

```javascript
const embedSvg = require('gulp-embed-svg');

gulp.task('embedSvgs', () =>
  gulp.src('*.html')
    .pipe(embedSvg({
      decodeEntities: true
    }))
    .pipe(gulp.dest('dist/')));
```

**Output**

```html
<html>
  <head><!-- ... --></head>
  <body>
    <!-- ... -->
    <span>Foo &#xA9; bar &#x1D306; baz &#x2603; qux</span>
    <svg class="icon"><!-- svg markup from github-icon.svg --></svg>
    <!-- ... -->
  </body>
</html>
```


### root `string`<a name="root"></a>

Provide the root folder where SVG source images are located.

#### default: [`__dirname`](https://nodejs.org/docs/latest/api/globals.html#globals_dirname)

The folder in which the task is executed.

#### Example: Alternate svg root

**HTML layout**

```html
<html>
  <head><!-- ... --></head>
  <body>
    <!-- ... -->
    <svg src="github-icon.svg"></svg>
    <!-- ... -->
  </body>
</html>
```

**Folder structure**
```bash
  /src
    index.html
    gulpfile.js
    /assets
      github-icon.svg
```

**Gulp task**

```javascript
const embedSvg = require('gulp-embed-svg');

gulp.task('embedSvgs', () =>
  gulp.src('*.html')
    .pipe(embedSvg({
      root: './assets'
    }))
    .pipe(gulp.dest('dist/')));
```

### createSpritesheet `boolean`<a name="create-spritesheet"></a>

Set to `true` to embed SVGs via a spritesheet. This reduces generated HTML filesize if you use the same SVG several times on a page.

#### default: `false`

**Attention:** If your SVGs contain gradients, please make sure their respective `id` attribute values are unique among *all* gradients that are embedded on your page. The reason behind this is that, in order to support most (if not all) browsers, we need to extract gradient definitions from the SVGs and save them separately in the spritesheet. If there are duplicate gradient `id`s, the browser is having a hard time determining which one to use.

#### Example: Create an svg spritesheet

**HTML Layout**

```html
<html>
  <head><!-- ... --></head>
  <body>
    <!-- ... -->
    <svg src="github-icon.svg"></svg>
    <!-- ... -->
    <svg src="github-icon.svg"></svg>
    <!-- ... -->
  </body>
</html>
```

**Folder structure**

```bash
  /src
    index.html
    gulpfile.js
    /assets
      github-icon.svg
```

**Gulp task**

```javascript
const embedSvg = require('gulp-embed-svg');

gulp.task('embedSvgs', () =>
  gulp.src('*.html')
    .pipe(embedSvg({
      root: './assets',
      createSpritesheet: true
    }))
    .pipe(gulp.dest('dist/')));
```

**Output**

```html
<html>
  <head><!-- ... --></head>
  <body>
    <svg class="svg-sprites">
      <symbol id="svg-sprite-0">
        <!-- source of github-icon.svg -->
      </symbol>
    </svg>
    <!-- ... -->
    <svg>
      <use xlink:href="#svg-sprite-0">
    </svg>
    <!-- ... -->
    <svg>
      <use xlink:href="#svg-sprite-0">
    </svg>
    <!-- ... -->
  </body>
</html>
```

### spritesheetClass `string`<a name="spritesheet-class"></a>

Customize the CSS class assigned to the generated spritesheet.

#### default: `svg-sprites`

#### Example: Change spritesheet class to my-sprites

**HTML Layout**

```html
<html>
  <head><!-- ... --></head>
  <body>
    <!-- ... -->
    <svg src="github-icon.svg"></svg>
    <!-- ... -->
    <svg src="github-icon.svg"></svg>
    <!-- ... -->
  </body>
</html>
```

**Folder structure**

```bash
  /src
    index.html
    gulpfile.js
    /assets
      github-icon.svg
```

**Gulp task**

```javascript
const embedSvg = require('gulp-embed-svg');

gulp.task('embedSvgs', () =>
  gulp.src('*.html')
    .pipe(embedSvg({
      root: './assets',
      createSpritesheet: true,
      spritesheetClass: 'my-sprites'
    }))
    .pipe(gulp.dest('dist/')));
```

**Output**

```html
<html>
  <head><!-- ... --></head>
  <body>
    <svg class="my-sprites">
      <symbol id="svg-sprite-0">
        <!-- source of github-icon.svg -->
      </symbol>
    </svg>
    <!-- ... -->
    <svg>
      <use xlink:href="#svg-sprite-0">
    </svg>
    <!-- ... -->
    <svg>
      <use xlink:href="#svg-sprite-0">
    </svg>
    <!-- ... -->
  </body>
</html>
```

### spriteIdFn `function` <a name="sprite-id-fn"></a>

Customize the `id` assigned to the sprites by providing a function that resolves path and index to a string. The function receives the absolute/resolved path to the source SVG file as well as the index of the sprite within the page as parameters.

#### default: ``(path, i) => `svg-sprite-${i}` ``

#### Example: Use the filename as id

**HTML Layout**

```html
<html>
  <head><!-- ... --></head>
  <body>
    <!-- ... -->
    <svg src="github-icon.svg"></svg>
    <!-- ... -->
    <svg src="javascript-icon.svg"></svg>
    <!-- ... -->
  </body>
</html>
```

**Folder structure**

```bash
  /src
    index.html
    gulpfile.js
    /assets
      github-icon.svg
      javascript-icon.svg
```

**Gulp task**

```javascript
const embedSvg = require('gulp-embed-svg');
const basename = require('path').basename;

gulp.task('embedSvgs', () =>
  gulp.src('*.html')
    .pipe(embedSvg({
      root: './assets',
      createSpritesheet: true,
      spriteIdFn: (path, i) => basename(path, '.svg')
    }))
    .pipe(gulp.dest('dist/')));
```

**Output**

```html
<html>
  <head><!-- ... --></head>
  <body>
    <svg class="svg-sprites">
      <symbol id="github-icon">
        <!-- source of github-icon.svg -->
      </symbol>
      <symbol id="javascript-icon">
        <!-- source of javascript-icon.svg -->
      </symbol>
    </svg>
    <!-- ... -->
    <svg>
      <use xlink:href="#github-icon">
    </svg>
    <!-- ... -->
    <svg>
      <use xlink:href="#javascript-icon">
    </svg>
    <!-- ... -->
  </body>
</html>
```

## [Changelog](CHANGELOG.md)

## [License](LICENSE)
