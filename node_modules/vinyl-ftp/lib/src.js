var assign = require( 'object-assign' );
var through = require( 'through2' );

module.exports = src;

function src( globs, options ) {

	options = assign( { buffer: true, read: true }, options );
	options = this.makeOptions( options );
	var self = this;

	var glob = this.glob( globs, options );

	if ( options.since ) {

		var filterSince = through.obj( function ( file, enc, cb ) {

			if ( options.since < file.ftp.date ) {

				return cb( null, file );

			}

			cb();

		} );

		glob = glob.pipe( filterSince );

	}

	if ( !options.read ) return glob;

	function getContents( file, cb ) {

		if ( self.isDirectory( file ) ) return cb( null, file );
		if ( options.buffer ) return self.downbuffer( file.path, onContents );
		self.downstream( file.path, onContents );

		function onContents( err, contents ) {

			if ( err ) return cb( err );
			file.contents = contents;

			cb( null, file );

		}

	}

	return glob.pipe( this.parallel( getContents, options ) );

}
