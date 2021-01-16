const through = require('through2');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const PluginError = require('plugin-error');

const PLUGIN_NAME = require('./package').name;
const defaults = {
  selectors: [
    'img[src$=".svg"]',
    'svg[src$=".svg"]'
  ],
  attrs: /^(?!src).*$/,
  root: __dirname,
  decodeEntities: false,
  createSpritesheet: false,
  spritesheetClass: 'svg-sprites',
  spriteIdFn: (path, i) => `svg-sprite-${i}`
};

module.exports = (opts = {}) =>
  through.obj((file, encoding, callback) => {
    if (file.isNull()) {
      return callback(null, file);
    }

    if (file.isStream()) {
      return callback(new PluginError(PLUGIN_NAME, 'Streams are not supported.'));
    }

    const options = Object.assign({}, defaults, opts);

    if (typeof options.decodeEntities !== 'boolean') {
      return callback(new PluginError(PLUGIN_NAME, 'Invalid option: decodeEntities must be a boolean'));
    }

    if (typeof options.root !== 'string') {
      return callback(new PluginError(PLUGIN_NAME, 'Invalid option: root must be a string'));
    } else if (!fs.existsSync(options.root)) {
      return callback(new PluginError(PLUGIN_NAME, `Invalid option: root path ${options.root} does not exist`));
    }

    if (typeof options.attrs === 'string') {
      options.attrs = new RegExp(options.attrs);
    } else if (!(options.attrs instanceof RegExp)) {
      return callback(new PluginError(PLUGIN_NAME, 'Invalid option: attrs must be either RegExp or string'));
    }

    if (typeof options.createSpritesheet !== 'boolean') {
      return callback(new PluginError(PLUGIN_NAME, 'Invalid option: createSpritesheet must be a boolean'));
    }

    if (typeof options.spritesheetClass !== 'string') {
      return callback(new PluginError(PLUGIN_NAME, 'Invalid option: spritesheetClass must be a string'));
    }

    if (typeof options.spriteIdFn !== 'function') {
      return callback(new PluginError(PLUGIN_NAME, 'Invalid option: spriteIdFn must be a function'));
    }

    let selectors;
    if (Array.isArray(options.selectors)) {
      selectors = options.selectors.filter((selector) => typeof selector === 'string')
        .join(',');
    } else if (typeof options.selectors === 'string') {
      selectors = options.selectors;
    } else {
      return callback(new PluginError(PLUGIN_NAME, `Invalid option: selectors must be either string or Array`));
    }

    const $ = cheerio.load(file.contents.toString(), {
      xmlMode: true
    });
    let didInline = false;
    let error;
    let sprites;
    let spritesheet;
    let i = 0;

    if (options.createSpritesheet) {
      spritesheet = $('<svg></svg>')
        .addClass(options.spritesheetClass)
        .attr('xmlns', 'http://www.w3.org/2000/svg');
      sprites = {};
      $('body').children()
        .first()
        .before(spritesheet);
    }

    $(selectors).each((index, element) => {
      const img = $(element);
      const src = img.attr('src');
      const absSrc = path.resolve(path.join(options.root, src));

      if (src
        && fs.existsSync(absSrc)
        && fs.statSync(absSrc).isFile()) {
        try {
          const svgSrc = $('svg', fs.readFileSync(absSrc, 'utf8'));
          let svgElement;
          if (options.createSpritesheet) {
            if (!sprites[src]) {
              const svgSymbol = $('<symbol></symbol>');
              const spriteId = options.spriteIdFn(absSrc, i);
              svgSymbol.attr('id', spriteId);
              Object.keys(svgSrc[0].attribs)
                .filter((attr) => !/xmlns/.test(attr))
                .forEach((attr) => svgSymbol.attr(attr, svgSrc.attr(attr)));
              const gradients = $('linearGradient, radialGradient', svgSrc);
              gradients.remove();
              spritesheet.append(gradients);
              svgSymbol.html(svgSrc.html());
              spritesheet.append(svgSymbol);
              sprites[src] = spriteId;
              i++;
            }

            svgElement = $('<svg></svg>')
              .attr('xmlns', 'http://www.w3.org/2000/svg')
              .append(
                $('<use>')
                  .attr('xlink:href', `#${sprites[src]}`)
              );
          } else {
            svgElement = svgSrc;
          }

          if (options.attrs) {
            Object.keys(img[0].attribs)
              .filter((attr) => options.attrs.test(attr))
              .forEach((attr) => svgElement.attr(attr, img.attr(attr)));
          }
          img.replaceWith(svgElement);
          didInline = true;
        } catch (err) {
          error = new PluginError(PLUGIN_NAME, err);
          return false;
        }
      } else {
        error = new PluginError(PLUGIN_NAME, `Invalid source path: ${src}`);
        return false;
      }
    });

    if (error) {
      return callback(error);
    }

    if (didInline) {
      file.contents = new Buffer.from($.html({
        decodeEntities: options.decodeEntities,
        xmlMode: false
      }));
    }

    callback(null, file);
  });
