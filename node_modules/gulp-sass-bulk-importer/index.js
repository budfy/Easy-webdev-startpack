
'use strict';

var path = require('path');
var fs = require('fs');
var through = require('through2');
var glob = require('glob');

module.exports = function() {

    var process = function(filename) {
        var replaceString = '';

        if (fs.statSync(filename).isDirectory()) {
            // Ignore directories start with _
            if (path.basename(filename).substring(0, 1) == '_') return '';
            
            fs.readdirSync(filename).forEach(function (file) {
                replaceString += process(filename + '/' + file);
            });
            return replaceString;
        } else {
            if (filename.substr(-4).match(/sass|scss/i)) {
                return '@import "' + filename + '";\n'
            } else {
                return '';
            }
        }
    }

    var transform = function(file, env, cb) {

        // find all instances matching
        var contents = file.contents.toString('utf-8');

        var reg               = /@import\s+[\"']([^\"']*\*[^\"']*)[\"'];?/;             // See: https://regex101.com/r/vL2pW5/1
        var regExcludeFiles   = /^(?!\/\/)\s*?@import\s+[\"'][^\"'*]*[\"']\s*;?/gm;     // See: https://regex101.com/r/aU3cA9/2
        var excludedFiles     = contents.match(regExcludeFiles) || [];
        
        // console.log(excludedFiles);

        var directory = path.dirname(file.path);
        var result;

        while((result = reg.exec(contents)) !== null) {

            var sub = result[0];
            var globName = result[1];

            var files = glob.sync(path.join(directory, globName));
            var replaceString = '';

            files.forEach(function(filename){
                var shouldReplace = !excludedFiles.some(function(excludedFile){
                  excludedFile = excludedFile.replace(/^\s*@import\s+/, '').replace(/^["']/g, '').replace(/["']\s*;?$/,'');
                  var pathEndsWith = new RegExp(excludedFile + '$');
                  return ~filename.replace(/\.(scss|sass)$/, '').search(pathEndsWith);
                });

                if(shouldReplace){
                  replaceString += process(filename);
                }
                
            });
            contents = contents.replace(sub, replaceString);
        }

        file.contents = Buffer.from(contents);
        cb(null, file);
    };
    return through.obj(transform);
};
