// © Zlatko Ladan 2013

// ## The View
define(['backbone', 'jade'], function (Backbone, Jade) {
	'use strict';

	return Backbone.View.extend({
		TEXT_TAG_FORMAT: 'p.text-center',
		INPUT_TEXT_TAG_FORMAT: 'input(type="text").text-center',
		HEADER_TAG_FORMAT: 'h1.text-container.text-center #{text}',
		CONTAINER_TAG_FORMAT: 'div.container',
		el: 'body',

		textTag: null,
		inputTextTag: null,

		text: function () {
			return this.model.get('HEADER_TEXT');
		},

		keyPress: function () {
			return this.model.keyPress(this.change());
		},

		change: function () {
			var that = this;

			return function (a_char) {
				that.inputTextTag.val(that.inputTextTag.val() + a_char);
			};
		},

		onLoadLang: function () {
			var that = this;

			return function () {
				that.inputTextTag.val("");
				that.textTag.text(that.model.getCurrentWord());
			};
		},

		events: {
			'bacon': 'change'
		},

		initialize: function () {
			var jContainer = null, jHeader = null,
				jText = null, jInputText = null,
				container = null;

			jContainer = Jade.compile(this.CONTAINER_TAG_FORMAT);
			jHeader = Jade.compile(this.HEADER_TAG_FORMAT);
			jText = Jade.compile(this.TEXT_TAG_FORMAT);
			jInputText = Jade.compile(this.INPUT_TEXT_TAG_FORMAT);
			this.model.on('change:wordId', this.onLoadLang());

			container = $(jContainer());
			this.textTag = $(jText());
			this.inputTextTag = $(jInputText());

			// Adds to the body
			$(this.el).append(container);

			// Adds to the container
			container.append(
				// Adds the header with text to the container
				jHeader({text: this.text()})
			);

			// Adds to the container
			container.append(
				// Adds text element to the container
				this.textTag
			);

			// Adds to the container
			container.append(
				// Adds the input text element to the container
				this.inputTextTag
			);

			$(this.inputTextTag).keypress(this.keyPress());
			this.model.getWordList();
		},

		render: function () {
		}
	});
});
