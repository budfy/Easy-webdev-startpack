module.exports = {

	mode: function ( folder, mode, options ) {

		options = this.makeOptions( options );
		var self = this;

		var stream = this.parallel( function ( file, cb ) {

			var path = self.join( '/', folder, file.relative );
			self.chmod( path, mode, cb );

		}, options );

		stream.resume();
		return stream;

	}

};
