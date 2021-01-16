module.exports = del;

function del( path, cb ) {

	var self = this;
	var rel;

	this.acquire( onAcquire );

	function onAcquire( err, ftp ) {

		rel = ftp;
		if ( err ) return final( err );

		self.log( 'DEL  ', path );
		ftp.delete( path, final );

	}

	function final( err ) {

		self.release( rel );
		cb( err );

	}

}
