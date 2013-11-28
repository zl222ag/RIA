//© Zlatko Ladan 2013

require.config({
	paths: {
		// Get all the required modules
		jquery: "script/jquery-2.0.3.min",
		backbone: "script/backbone",
		purebackbone: "script/backbone-min",
		underscore: "script/underscore-min",
	},
	shim: {
		// Shim for the modules
		jquery: { exports: "jQuery" },
		underscore: { exports: "_" },
		purebackbone: {
			deps: ["jquery", "underscore"],
			exports: "Backbone"
		}
	}
});

require(["app"], function (App) {
	// Start it all.
	App.start();
});
