// © Zlatko Ladan 2013

// ## The View
define(["backbone", "jade"], function (Backbone, Jade) {
	"use strict";
	return Backbone.View.extend({
		el: 'body',
		headerTagFormat: 'h1.text-container.text-center #{text}',
		textTagFormat: 'p.text-center',
		inputTextTagFormat: 'p.text-center',
		textTag: null,
		inputTextTag: null,

		text: function () {
			return this.model.HEADER_TEXT;
		},

		keyPress: function () {
			return this.model.keyPress(this.change());
		},

		onLoadLang: function () {
			var that = this;

			return function () {
				that.textTag.text(that.model.getCurrentWord());
			};
		},

		change: function () {
			var that = this;

			return function (a_char) {
				that.inputTextTag.text(that.inputTextTag.text() + a_char);
			};
		},

		render: function () {
			var jHeader = null, jText = null, jInputText = null;

			jHeader = Jade.compile(this.headerTagFormat);
			jText = Jade.compile(this.textTagFormat);
			jInputText = Jade.compile(this.inputTextTagFormat);

			// Adds to the body
			$(this.el).append(
				// Adds the header with text to the body
				jHeader({text: this.text()})
			);

			this.textTag = $(jText());

			// Adds to the body
			$(this.el).append(
				// Adds text element to the body
				this.textTag
			);

			this.inputTextTag = $(jInputText());

			// Adds to the body
			$(this.el).append(
				// Adds the input text element to the body
				this.inputTextTag
			);

			$(document).keypress(this.keyPress());
			this.model.getWordList(this.onLoadLang());
			return this;
		}
	});
});
