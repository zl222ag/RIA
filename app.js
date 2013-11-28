//© Zlatko Ladan 2013

// ## Starting module
define(["script/view.js", "script/model.js"], function (View, Model) {
	"use strict";
	return {
		// The function that starts everything.
		start: function () {
			// Renders the view using the model.
			new View({model: new Model()}).render();
		}
	};
});
