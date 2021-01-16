var assign = require( 'object-assign' );

module.exports = VinylFtp;

function VinylFtp( config ) {

	if ( !( this instanceof VinylFtp ) ) return new VinylFtp( config );

	this.config = assign( {
		parallel:       3,
		maxConnections: config.parallel || 5,
		log:            null,
		timeOffset:     0,
		idleTimeout:    100,
		password:       config.password || config.pass,
		reload:         false
	}, config );

	// connection pool
	this.queue = [];
	this.connectionCount = 0;
	this.idle = [];
	this.idleTimer = null;

}

VinylFtp.create = function ( config ) {

	return new VinylFtp( config );

};

VinylFtp.prototype.glob = require( './lib/glob' );
VinylFtp.prototype.src = require( './lib/src' );
VinylFtp.prototype.dest = require( './lib/dest' );
VinylFtp.prototype.delete = require( './lib/delete' );
VinylFtp.prototype.rmdir = require( './lib/rmdir' );
VinylFtp.prototype.dest = require( './lib/dest' );
VinylFtp.prototype.clean = require( './lib/clean' );

assign(
	VinylFtp.prototype,
	require( './lib/filter' ),
	require( './lib/mode' ),
	require( './lib/ftp' ),
	require( './lib/helpers' )
);
