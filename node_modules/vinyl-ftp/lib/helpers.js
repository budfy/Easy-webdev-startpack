var Path = require( 'path' );
var assign = require( 'object-assign' );
var parallel = require( 'parallel-transform' );

var RE_BS = /\\/g;

module.exports = {

	parallel: function ( transform, options ) {

		options = assign( {}, this.config, options );
		var p = Math.max( 1, parseInt( options.parallel ) );
		var stream = parallel( p, transform );

		return stream;

	},

	makeOptions: function ( options ) {

		options = options || {};
		if ( options.reload ) this.reload();
		return options;

	},

	fixDate: function ( date ) {

		if ( !date ) return null;

		var offset = 0;

		if ( this.config.timeOffset ) offset += this.config.timeOffset * 60000;

		return new Date( date.valueOf() + offset );

	},

	isDirectory: function ( vf ) {

		return vf.ftp.type.match( /^d|dir/i );

	},

	normalize: function ( path ) {

		return Path.normalize( path ).replace( RE_BS, '/' );

	},

	join: function () {

		return Path.join.apply( Path, arguments ).replace( RE_BS, '/' );

	},

	log: function () {

		var log = this.config.log;

		if ( typeof log === 'function' ) log.apply( undefined, arguments );

	}

};
