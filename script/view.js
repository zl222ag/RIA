//© Zlatko Ladan 2013

// ## The View
define(["backbone"], function (Backbone) {
	"use strict";
	return Backbone.View.extend({
		el: 'body',
		headerTagName: '<h1 />',
		textTagName: '<p />',
		headerClass: "text-container text-center",
		textClass: "text-center",
		textTag: null,

		text: function () {
			return this.model.text;
		},

		keyPress: function () {
			return this.model.keyPress(this.change());
		},

		change: function () {
			var that = this;
			return function (a_char) {
				that.textTag.text(that.textTag.text() + a_char);
			};
		},

		render: function () {
			// Adds to the body
			$(this.el).append(
				// Adds the header with text to the body
				$(this.headerTagName).text(this.text()).addClass(this.headerClass)
			);

			this.textTag = $(this.textTagName).addClass(this.textClass);

			// Adds to the body
			$(this.el).append(
				// Adds text element to the body
				this.textTag
			);

			$(document).keypress(this.keyPress());
			return this;
		}
	});
});
