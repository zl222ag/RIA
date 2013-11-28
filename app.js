//© Zlatko Ladan 2013

// ## Starting module
define(["backbone", "script/view.js", "script/model.js"], function (Backbone, View, Model) {
	return {
		// The function that starts everything.
		start: function () {
			// Renders the view using the model.
			new View({model: new Model()}).render();
		}
	};
});
