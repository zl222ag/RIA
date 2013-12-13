// © Zlatko Ladan 2013

// ## Base file
require.config({
	paths: {
		// Get all the required modules
		jquery: 'script/libs/jquery-2.0.3.min',
		backbone: 'script/app/backbone',
		purebackbone: 'script/libs/backbone-min',
		underscore: 'script/libs/underscore-min',
		jade: 'script/libs/jade',
		text: 'script/libs/text'
	},

	shim: {
		// Shim for the modules
		jquery: { exports: 'jQuery' },
		underscore: { exports: '_' },
		purebackbone: {
			deps: ['jquery', 'underscore'],
			exports: 'Backbone'
		}
	}
});

require(['app'], function (App) {
	'use strict';
	// Start it all.
	App.start();
});
