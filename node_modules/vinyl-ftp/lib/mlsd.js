/**
 * MLSD method for the node ftp module
 * This is mostly copied from https://github.com/mscdex/node-ftp
 * Original Copyright Brian White: https://github.com/mscdex
 * MLSD implemented by Morris Brodersen <mb@morrisbrodersen.de>
 */

var RE_EOL = /\r?\n/g,
    RE_SEP = /;/g,
    RE_EQ = /=/;

module.exports = function(path, zcomp, cb) {
  var self = this, cmd;

  if (typeof path === 'function') {
    // list(function() {})
    cb = path;
    path = undefined;
    cmd = 'MLSD';
    zcomp = false;
  } else if (typeof path === 'boolean') {
    // list(true, function() {})
    cb = zcomp;
    zcomp = path;
    path = undefined;
    cmd = 'MLSD';
  } else if (typeof zcomp === 'function') {
    // list('/foo', function() {})
    cb = zcomp;
    cmd = 'MLSD ' + path;
    zcomp = false;
  } else
    cmd = 'MLSD ' + path;

  this._pasv(function(err, sock) {
    if (err)
      return cb(err);

    if (self._queue[0] && self._queue[0].cmd === 'ABOR') {
      sock.destroy();
      return cb(new Error('Client aborted'));
    }

    var sockerr, done = false, replies = 0, entries, buffer = '', source = sock;

    if (zcomp) {
      source = zlib.createInflate();
      sock.pipe(source);
    }

    source.on('data', function(chunk) { buffer += chunk.toString('binary'); });
    source.once('error', function(err) {
      if (!sock.aborting)
        sockerr = err;
    });
    source.once('end', ondone);
    source.once('close', ondone);

    function ondone() {
      done = true;
      final();
    }
    function final() {
      if (done && replies === 2) {
        replies = 3;
        if (sockerr)
          return cb(new Error('Unexpected data connection error: ' + sockerr));
        if (sock.aborting)
          return cb(new Error('Client aborted'));

        //

        // process received data

        entries = buffer.split( RE_EOL );
        entries.pop(); // ending EOL
        entries = entries.map( function( entry ) {
          var kvs = entry.split( RE_SEP );
          var obj = { name: kvs.pop().substring( 1 ) };
          kvs.forEach( function( kv ) {

            kv = kv.split( RE_EQ );
            obj[ kv[0].toLowerCase() ] = kv[1];

          } );

          obj.size = parseInt( obj.size );

          var modify = obj.modify;

          if (modify) {
            var year = modify.substr( 0, 4 );
            var month = modify.substr( 4, 2 );
            var date = modify.substr( 6, 2 );
            var hour = modify.substr( 8, 2 );
            var minute = modify.substr( 10, 2 );
            var second = modify.substr( 12, 2 );
            obj.date = new Date(
              year + '-' + month + '-' + date + 'T' + hour + ':' +minute + ':' + second
            );

          }

          return obj;
        } );

        //

        if (zcomp) {
          self._send('MODE S', function() {
            cb(undefined, entries);
          }, true);
        } else
          cb(undefined, entries);
      }
    }

    if (zcomp) {
      self._send('MODE Z', function(err, text, code) {
        if (err) {
          sock.destroy();
          return cb(makeError(code, 'Compression not supported'));
        }
        sendList();
      }, true);
    } else
      sendList();

    function sendList() {
      // this callback will be executed multiple times, the first is when server
      // replies with 150 and then a final reply to indicate whether the
      // transfer was actually a success or not
      self._send(cmd, function(err, text, code) {
        if (err) {
          sock.destroy();
          if (zcomp) {
            self._send('MODE S', function() {
              cb(err);
            }, true);
          } else
            cb(err);
          return;
        }

      // some servers may not open a data connection for empty directories
      if (++replies === 1 && code === 226) {
        replies = 2;
        sock.destroy();
        final();
      } else if (replies === 2)
        final();
      }, true);
    }
  });
};
