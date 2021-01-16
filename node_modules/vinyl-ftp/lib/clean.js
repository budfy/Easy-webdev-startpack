var Fs = require( 'fs' );
var Path = require( 'path' );

module.exports = clean;

function clean( globs, local, options ) {

	options = this.makeOptions( options );
	var self = this;

	var glob = this.glob( globs, options );

	function stat( remote, cb ) {

		Fs.stat( Path.join( local, remote.relative ), function ( err, stats ) {
			check( err, remote, stats, cb );
		} );

	}

	function check( err, remote, stats, cb ) {

		var method;

		if ( err ) {
			if ( err.message.match( /ENOENT/ ) ) {
				if ( self.isDirectory( remote ) ) {
					method = 'rmdir';
				} else {
					method = 'delete';
				}
			} else {
				return cb( err );
			}
		}

		if ( method ) {
			self[ method ]( self.normalize(remote.path), cb );
		} else {
			cb();
		}
	}

	return glob.pipe( this.parallel( stat, options ) );

}
