define(["backbone"], function (Backbone) {
	return Backbone.View.extend({
		el: 'body',
		tag: '<h1 />',
		text: function () {
			return this.model.text
		},

		render: function () {
			$(this.el).append(
				$(this.tag).append(this.text())
			);

			return this;
		}
	});
});
