const fs = require('fs');
const chalk = require('chalk');

let srcFonts = 'src/scss/_local-fonts.scss';
let appFonts = 'docs/fonts/';
module.exports = function fonts(done) {
  fs.writeFile(srcFonts, '', () => {});
  fs.readdir(appFonts, (err, items) => {
    if (items) {
      let c_fontname;
      for (let i = 0; i < items.length; i++) {
        let fontname = items[i].split('.'),
          fontExt;
        fontExt = fontname[1];
        fontname = fontname[0];
        if (c_fontname != fontname) {
          if (fontExt == 'woff' || fontExt == 'woff2') {
            fs.appendFile(srcFonts, `@include font-face("${fontname}", "${fontname}", 400);\r\n`, () => {});
            console.log(chalk `
{bold {bgGray Added new font: ${fontname}.}
----------------------------------------------------------------------------------
{bgYellow.black Please, move mixin call from {cyan src/scss/_local-fonts.scss} to {cyan src/scss/global/_fonts.scss} and then change it!}}
----------------------------------------------------------------------------------
`);
          }
        }
        c_fontname = fontname;
      }
    }
  })
  done();
}