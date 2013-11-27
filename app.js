define(["backbone", "script/view.js", "script/model.js"], function (Backbone, View, Model) {
	return {
		start: function () {
			new View({model: new Model()}).render();
		}
	};
});
