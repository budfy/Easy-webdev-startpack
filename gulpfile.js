const gulp = require('gulp');
const requireDir = require('require-dir');
const tasks = requireDir('./tasks');

exports.style_libs = tasks.style_libs;
exports.style = tasks.style;
exports.js_build = tasks.js_build;
exports.js_libs = tasks.js_libs;
exports.js_dev = tasks.js_dev;
exports.pug = tasks.pug;
exports.img_rastr = tasks.img_rastr;
exports.ttf = tasks.ttf;
exports.bs_html = tasks.bs_html;
exports.watch = tasks.watch;
exports.deploy = tasks.deploy;

exports.default = gulp.parallel(
  exports.style_libs,
  exports.ttf,
  exports.style,
  exports.js_libs,
  exports.js_dev,
  exports.img_rastr,
  exports.pug,
  exports.bs_html,
  exports.watch
)
