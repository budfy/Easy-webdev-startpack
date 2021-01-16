const ttf2woff2 = require("ttf2woff2");
const PluginError = require("plugin-error");
const Transform = require("stream").Transform;
const path = require("path");

const PLUGIN_NAME = "gulp-ttftowoff2";

module.exports = (options = {}) => {
  return new Transform({
    objectMode: true,
    transform(chunk, encoding, callback) {
      // Return if empty or null
      if (chunk._contents.length === 0 || chunk.isNull()) {
        return callback(null, chunk);
      }

      // Return if not ttf extension
      if (path.extname(chunk.path) !== ".ttf") {
        return callback(null, chunk);
      }

      // Rename extension
      chunk.path = path.join(
        path.dirname(chunk.path),
        path.basename(chunk.path, path.extname(chunk.path)) + ".woff2"
      );

      if (chunk.isBuffer()) {
        try {
          chunk._contents = Buffer.from(
            ttf2woff2(chunk._contents, options).buffer
          );
          return callback(null, chunk);
        } catch (error) {
          return callback(
            new PluginError(PLUGIN_NAME, error, { fileName: chunk.relative })
          );
        }
      } else if (chunk.isStream()) {
        return callback(
          new PluginError(PLUGIN_NAME, "Streaming is not supported.")
        );
      }
    },
  });
};
