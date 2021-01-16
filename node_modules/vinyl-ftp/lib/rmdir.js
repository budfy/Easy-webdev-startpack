module.exports = rmdir;

function rmdir( path, cb ) {

	var self = this;
	var rel;

	this.acquire( onAcquire );

	function onAcquire( err, ftp ) {

		rel = ftp;
		if ( err ) return final( err );

		self.log( 'RMDIR', path );
		ftp.rmdir( path, true, final );

	}

	function final( err ) {

		self.release( rel );
		if ( err && err.message.match( /no such file/i ) ) return cb();
		cb( err );

	}

}
