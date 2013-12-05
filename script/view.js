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
			// Check for the character and
			// sends it to the model to check
			// if it is the same, then fixes with
			// the cleared part and the non cleared.
			var that = this, word = null, splitIndex = 0;

			return function (e) {
				e.preventDefault();
				if (e.ctrlKey || e.charCode < 32) {
					return;
				}

				if (that.model.guessChar(String.fromCharCode(e.charCode).toLowerCase())) {
					splitIndex = that.model.get('currentLetterId');
					word = that.model.getCurrentWord();
					that.clearedWordTag.text(word.substr(0, splitIndex));
					that.wordTag.text(word.substr(splitIndex));
				}
			};
		},

		onChangeWord: function () {
			var that = this;

			return function () {
				that.clearedWordTag.text('');
				that.wordTag.text(that.model.getCurrentWord());
			};
		},

		events: {
			'bacon': 'change'
		},

		initialize: function () {
			// Adds container and adds to it a header and
			// a container containing cleared parts of the
			// word and the uncleared  parts and also adds
			// a input for reading.

			var jContainer = null, jHeader = null, jWordContainer = null,
				jCleared = null, jWord = null, jInputText = null,
				container = null, wordContainer = null;

			jContainer = Jade.compile(this.CONTAINER_TAG_FORMAT);
			jHeader = Jade.compile(this.HEADER_TAG_FORMAT);
			jWordContainer = Jade.compile(this.WORD_CONTAINER_TAG_FORMAT);
			jCleared = Jade.compile(this.CLEARED_WORD_TAG_FORMAT);
			jWord = Jade.compile(this.WORD_TAG_FORMAT);
			jInputText = Jade.compile(this.INPUT_WORD_TAG_FORMAT);
			this.model.on('change:wordId', this.onChangeWord());

			container = $(jContainer());
			wordContainer = $(jWordContainer());
			this.clearedWordTag = $(jCleared());
			this.wordTag = $(jWord());
			this.inputWordTag = $(jInputText());

			container.append(jHeader({text: this.getHeaderText()}));
			wordContainer.append(this.clearedWordTag);
			wordContainer.append(this.wordTag);
			container.append(wordContainer);
			container.append(this.inputWordTag);
			$(this.el).append(container);

			$(this.inputWordTag).keypress(this.keyPress());
			this.model.getWordList();
		},

		render: function () {
		}
	});
});
