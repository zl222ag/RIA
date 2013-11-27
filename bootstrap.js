require.config({
	paths: {
		jquery: "script/jquery-2.0.3.min",
		backbone: "script/backbone",
		purebackbone: "script/backbone-min",
		underscore: "script/underscore-min",
	},
	shim: {
		jquery: { exports: "jQuery" },
		underscore: { exports: "_" },
		purebackbone: {
			deps: ["jquery", "underscore"],
			exports: "Backbone"
		}
	}
});

require(["app"], function (App) {
	App.start();
});
