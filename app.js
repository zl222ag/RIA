// © Zlatko Ladan 2013

// ## Starting module
define(['script/app/router'], function (Router) {
	'use strict';

	return {
		// The function that starts everything.
		start: function () {
			// Runs the router.
			new Router();
		}
	};
});
