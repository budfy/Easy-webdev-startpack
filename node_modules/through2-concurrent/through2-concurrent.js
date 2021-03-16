// Like through2 except execute in parallel with a set maximum
// concurrency
"use strict";
var through2 = require('through2');

function cbNoop (cb) {
  cb();
}

module.exports = function concurrentThrough (options, transform, flush) {
  var concurrent = 0, lastCallback = null, pendingFinish = null;

  if (typeof options === 'function') {
    flush     = transform;
    transform = options;
    options   = {};
  }

  var maxConcurrency = options.maxConcurrency || 16;

  function _transform (message, enc, callback) {
    var self = this;
    var callbackCalled = false;
    concurrent++;
    if (concurrent < maxConcurrency) {
      // Ask for more right away
      callback();
    } else {
      // We're at the concurrency limit, save the callback for
      // when we're ready for more
      lastCallback = callback;
    }

    transform.call(this, message, enc, function (err) {
      // Ignore multiple calls of the callback (shouldn't ever
      // happen, but just in case)
      if (callbackCalled) return;
      callbackCalled = true;

      if (err) {
        self.emit('error', err);
      } else if (arguments.length > 1) {
        self.push(arguments[1]);
      }

      concurrent--;
      if (lastCallback) {
        var cb = lastCallback;
        lastCallback = null;
        cb();
      }
      if (concurrent === 0 && pendingFinish) {
        pendingFinish();
        pendingFinish = null;
      }
    });
  }

  // We need to pass in final to through2 even if the caller has
  // not given us a final option  so that it will wait for all
  // transform callbacks to complete before emitting a "finish"
  // and "end" event.
  if (typeof options.final !== 'function') {
    options.final = cbNoop;
  }
  // We also wrap flush to make sure anyone using an ancient version
  // of through2 without support for final will get the old behaviour.
  // TODO: don't wrap flush after upgrading through2 to a version with guaranteed `_final`
  if (typeof flush !== 'function') {
    flush = cbNoop;
  }

  // Flush is always called only after Final has finished
  // to ensure that data from Final gets processed, so we only need one pending callback at a time
  function callOnFinish (original) {
    return function (callback) {
      if (concurrent === 0) {
        original.call(this, callback);
      } else {
        pendingFinish = original.bind(this, callback);
      }
    }
  }

  options.final = callOnFinish(options.final);
  return through2(options, _transform, callOnFinish(flush));
};

module.exports.obj = function (options, transform, flush) {
  if (typeof options === 'function') {
    flush     = transform;
    transform = options;
    options   = {};
  }

  options.objectMode = true;
  if (options.highWaterMark == null) {
    options.highWaterMark = 16;
  }
  return module.exports(options, transform, flush);
};
