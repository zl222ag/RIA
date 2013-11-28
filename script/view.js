//© Zlatko Ladan 2013

// ## The View
define(["backbone"], function (Backbone) {
	"use strict";
	return Backbone.View.extend({
		el: 'body',
		tag: '<h1 />',
		text: function () {
			return this.model.text;
		},

		render: function () {
			// Adds to the element
			$(this.el).append(
				// Adds the text to the element
				$(this.tag).append(this.text())
			);

			return this;
		}
	});
});
