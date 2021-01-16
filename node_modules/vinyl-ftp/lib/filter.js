/**
 * Filter vinyl streams based on local and remote file
 */

module.exports = {

	newer: function ( folder, options ) {

		options = this.makeOptions( options );
		return this.filter( folder, function ( file, remote, cb ) {

			cb( null, !remote || file.stat.mtime > remote.ftp.date );

		}, options );

	},

	differentSize: function ( folder, options ) {

		options = this.makeOptions( options );
		return this.filter( folder, function ( file, remote, cb ) {

			cb( null, !remote || file.stat.size !== remote.ftp.size );

		}, options );

	},

	newerOrDifferentSize: function ( folder, options ) {

		options = this.makeOptions( options );
		return this.filter( folder, function ( file, remote, cb ) {

			cb( null, !remote || file.stat.mtime > remote.ftp.date || file.stat.size !== remote.ftp.size );

		}, options );

	},

	filter: function ( folder, filter, options ) {

		options = this.makeOptions( options );
		var self = this;

		return this.parallel( function ( file, cb ) {

			var path = self.join( '/', folder, file.relative );

			self.remote( path, onRemote );

			function onRemote( err, remote ) {

				if ( err ) return cb( err );
				filter( file, remote, onFilter );

			}

			function onFilter( err, emit ) {

				cb( err, emit ? file : null );

			}

		}, options );

	}

};
