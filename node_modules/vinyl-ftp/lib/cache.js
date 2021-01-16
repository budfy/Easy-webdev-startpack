/**
 * A cache keeps track of async resources and actions that
 * should be loaded or executed only once.
 */

module.exports = function ( fn ) {

	var cache = {};

	this.get = function ( id, cb ) {

		var entry = cache[ id ];

		if ( entry ) {

			if ( entry.done ) {

				if ( cb ) cb( entry.err, entry.data );

			} else {

				entry.queue.push( cb );

			}

			return;

		}

		entry = cache[ id ] = {
			done:  false,
			err:   null,
			data:  null,
			queue: [ cb ]
		};

		fn( id, function ( err, data ) {

			entry.done = true;
			entry.err =   err;
			entry.data =  data;
			entry.queue.forEach( function ( cb ) {

				if ( cb ) cb( err, data );

			} );
			entry.queue = null;

		} );

	};

	this.clear = function () {

		cache = {};

	};

	this.remove = function ( id ) {

		delete cache[ id ];

	};

};
