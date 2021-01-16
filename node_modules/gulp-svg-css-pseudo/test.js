/*!
 * Copyright (c) 2015 All Rights Reserved by the SDL Group.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';
var fs = require('fs');
var assert = require('assert');
var streamAssert = require('stream-assert');
var gutil = require('gulp-util');
var svgcss = require('./');
var css = require('css');
var testData = {
    collpasedSvg: fs.readFileSync(__dirname + '/testdata/collapsed.svg'),
    expandedSvg: fs.readFileSync(__dirname + '/testdata/expanded.svg'),
    noSize: fs.readFileSync(__dirname + '/testdata/nosize.svg'),
    customSize: fs.readFileSync(__dirname + '/testdata/customsize.svg'),
    nopxInSize: fs.readFileSync(__dirname + '/testdata/nopxinsize.svg'),
    nameWithDotsAndSpaces: fs.readFileSync(__dirname + '/testdata/name.with.dots and spaces.svg')
};

it('should minify svg and output css file', function (done) {
    var stream = svgcss();

    stream
        .pipe(streamAssert.length(1))
        .pipe(streamAssert.first(function (newFile) {
            var fileContents = newFile.contents.toString();
            assert.equal(newFile.basename, 'icons.css');
            assert.equal(newFile.contents.length, 1125);
            // Check if special characters are escaped
            assert.equal(fileContents.indexOf('<'), -1, 'Contains < char');
            assert.equal(fileContents.indexOf('>'), -1, 'Contains > char');
            assert.equal(fileContents.indexOf('#'), -1, 'Contains # char');
            // Check if rules are ok
            var parsedCss = css.parse(fileContents);
            assert.equal(parsedCss.stylesheet.rules.length, 2);
            // No dots inside
            assert.equal(parsedCss.stylesheet.rules[0].selectors[0], '.icon-collapsed-16x16');
            // Check size (should not be there as the default of addSize is false)
            assert.equal(parsedCss.stylesheet.rules[0].declarations[1], undefined);
            assert.equal(parsedCss.stylesheet.rules[0].declarations[1], undefined);
        }))
        .pipe(streamAssert.end(done));

    stream.write(new gutil.File({
        path: 'collapsed.16x16.svg',
        contents: new Buffer(testData.collpasedSvg)
    }));
    stream.write(new gutil.File({
        path: 'expanded.16x16.svg',
        contents: new Buffer(testData.expandedSvg)
    }));
    stream.end();
});

it('should use sizes from svg source', function (done) {
    var stream = svgcss({ addSize: true });

    stream
       .pipe(streamAssert.length(1))
       .pipe(streamAssert.first(function (newFile) {
           var fileContents = newFile.contents.toString();
           // Check if rules are ok
           var parsedCss = css.parse(fileContents);
           assert.equal(parsedCss.stylesheet.rules.length, 2);
           // Check size
           assert.equal(parsedCss.stylesheet.rules[0].declarations[1].property, 'width');
           assert.equal(parsedCss.stylesheet.rules[0].declarations[1].value, '1234px');
           assert.equal(parsedCss.stylesheet.rules[0].declarations[2].property, 'height');
           assert.equal(parsedCss.stylesheet.rules[0].declarations[2].value, '4321px');
           assert.equal(parsedCss.stylesheet.rules[1].declarations[1].property, 'width');
           assert.equal(parsedCss.stylesheet.rules[1].declarations[1].value, '12345px');
           assert.equal(parsedCss.stylesheet.rules[1].declarations[2].property, 'height');
           assert.equal(parsedCss.stylesheet.rules[1].declarations[2].value, '54321px');
       }))
       .pipe(streamAssert.end(done));

    stream.write(new gutil.File({
        path: 'customsize.svg',
        contents: new Buffer(testData.customSize)
    }));
    stream.write(new gutil.File({
        path: 'nopxinsize.svg',
        contents: new Buffer(testData.nopxInSize)
    }));
    stream.end();
});


it('should be able to change css file name', function (done) {
    var stream = svgcss({
        fileName: 'common'
    });

    stream
       .pipe(streamAssert.length(1))
       .pipe(streamAssert.first(function (newFile) {
           assert.equal(newFile.basename, 'common.css');
       }))
       .pipe(streamAssert.end(done));

    stream.write(new gutil.File({
        path: 'collapsed.16x16.svg',
        contents: new Buffer(testData.collpasedSvg)
    }));
    stream.end();
});

it('should be able to change the file extension', function (done) {
    var stream = svgcss({
        fileExt: 'scss'
    });

    stream
       .pipe(streamAssert.length(1))
       .pipe(streamAssert.first(function (newFile) {
           assert.equal(newFile.basename, 'icons.scss');
       }))
       .pipe(streamAssert.end(done));

    stream.write(new gutil.File({
        path: 'collapsed.16x16.svg',
        contents: new Buffer(testData.collpasedSvg)
    }));
    stream.end();
});

it('should be able to change css prefix', function (done) {
    var stream = svgcss({
        cssPrefix: 'icons-list-'
    });

    stream
       .pipe(streamAssert.length(1))
       .pipe(streamAssert.first(function (newFile) {
           var fileContents = newFile.contents.toString();
           // Check if rules are ok
           var parsedCss = css.parse(fileContents);
           assert.equal(parsedCss.stylesheet.rules.length, 1);
           // No dots inside
           assert.equal(parsedCss.stylesheet.rules[0].selectors[0], '.icons-list-collapsed-16x16');
       }))
       .pipe(streamAssert.end(done));

    stream.write(new gutil.File({
        path: 'collapsed.16x16.svg',
        contents: new Buffer(testData.collpasedSvg)
    }));
    stream.end();
});

it('should be able to change default height and width', function (done) {
    var stream = svgcss({
        addSize: true,
        defaultHeight: '32px',
        defaultWidth: '32px'
    });

    stream
       .pipe(streamAssert.length(1))
       .pipe(streamAssert.first(function (newFile) {
           var fileContents = newFile.contents.toString();
           // Check if rules are ok
           var parsedCss = css.parse(fileContents);
           assert.equal(parsedCss.stylesheet.rules.length, 2);
           // Check size
           assert.equal(parsedCss.stylesheet.rules[0].declarations[1].property, 'width');
           assert.equal(parsedCss.stylesheet.rules[0].declarations[1].value, '32px');
           assert.equal(parsedCss.stylesheet.rules[0].declarations[2].property, 'height');
           assert.equal(parsedCss.stylesheet.rules[0].declarations[2].value, '32px');
           // Check size
           assert.equal(parsedCss.stylesheet.rules[1].declarations[1].property, 'width');
           assert.equal(parsedCss.stylesheet.rules[1].declarations[1].value, '1234px');
           assert.equal(parsedCss.stylesheet.rules[1].declarations[2].property, 'height');
           assert.equal(parsedCss.stylesheet.rules[1].declarations[2].value, '4321px');
       }))
       .pipe(streamAssert.end(done));

    stream.write(new gutil.File({
        path: 'nosize.svg',
        contents: new Buffer(testData.noSize)
    }));
    stream.write(new gutil.File({
        path: 'customsize.svg',
        contents: new Buffer(testData.customSize)
    }));
    stream.end();
});

it('creates a proper css clas from the file name', function (done) {
    var stream = svgcss();

    stream
       .pipe(streamAssert.length(1))
       .pipe(streamAssert.first(function (newFile) {
           var fileContents = newFile.contents.toString();
           // Check if rules are ok
           var parsedCss = css.parse(fileContents);
           assert.equal(parsedCss.stylesheet.rules.length, 1);
           // No dots or spaces inside the class name
           assert.equal(parsedCss.stylesheet.rules[0].selectors[0], '.icon-name-with-dots-and-spaces');
       }))
       .pipe(streamAssert.end(done));

    stream.write(new gutil.File({
        path: 'name.with.dots and spaces.svg',
        contents: new Buffer(testData.nameWithDotsAndSpaces)
    }));
    stream.end();
});
