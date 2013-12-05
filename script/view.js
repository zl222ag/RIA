// © Zlatko Ladan 2013

// ## The View
define(['backbone', 'jade'], function (Backbone, Jade) {
	'use strict';

	return Backbone.View.extend({
		WORD_CONTAINER_TAG_FORMAT: 'div.text-center',
		CLEARED_WORD_TAG_FORMAT: 'span.cleared',
		WORD_TAG_FORMAT: 'span',
		INPUT_WORD_TAG_FORMAT: 'input(type="text", maxlength=1).text-center',
		HEADER_TAG_FORMAT: 'h1.text-container.text-center #{text}',
		CONTAINER_TAG_FORMAT: 'div.container',
		el: 'body',

		clearedWordTag: null,
		wordTag: null,
		inputWordTag: null,

		getHeaderText: function () {
			return this.model.get('HEADER_TEXT');
		},

		keyPress: function () {
			var that = this;

			return function (e) {
				e.preventDefault();
				if (e.ctrlKey || e.charCode < 32) {
					return;
				}

				if (that.model.guessChar(String.fromCharCode(e.charCode).toLowerCase())) {
					//gnäll gnäll.
				}
			};
		},

		onLoadLang: function () {
			var that = this;

			return function () {
				that.inputWordTag.val('');
				that.wordTag.text(that.model.getCurrentWord());
			};
		},

		events: {
			'bacon': 'change'
		},

		initialize: function () {
			var jContainer = null, jHeader = null, jWordContainer = null,
				jCleared = null, jWord = null, jInputText = null,
				container = null, wordContainer = null;

			jContainer = Jade.compile(this.CONTAINER_TAG_FORMAT);
			jHeader = Jade.compile(this.HEADER_TAG_FORMAT);
			jWordContainer = Jade.compile(this.WORD_CONTAINER_TAG_FORMAT);
			jCleared = Jade.compile(this.CLEARED_WORD_TAG_FORMAT);
			jWord = Jade.compile(this.WORD_TAG_FORMAT);
			jInputText = Jade.compile(this.INPUT_WORD_TAG_FORMAT);
			this.model.on('change:wordId', this.onLoadLang());

			container = $(jContainer());
			wordContainer = $(jWordContainer());
			this.clearedWordTag = $(jCleared());
			this.wordTag = $(jWord());
			this.inputWordTag = $(jInputText());

			// Adds to the container
			container.append(
				// Adds the header with text to the container
				jHeader({text: this.getHeaderText()})
			);

			wordContainer.append(
				this.clearedWordTag
			);

			wordContainer.append(
				this.wordTag
			);

			// Adds to the container
			container.append(
				// Adds text element to the container
				wordContainer
			);

			// Adds to the container
			container.append(
				// Adds the input text element to the container
				this.inputWordTag
			);

			// Adds to the body
			$(this.el).append(container);

			$(this.inputWordTag).keypress(this.keyPress());
			this.model.getWordList();
		},

		render: function () {
		}
	});
});
