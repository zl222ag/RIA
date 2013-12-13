// © Zlatko Ladan 2013

// ## The View
define(['backbone', 'jade'], function (Backbone, Jade) {
	'use strict';

	return Backbone.View.extend({
		WORD_CONTAINER_TAG_FORMAT: 'div.text-center',
		CLEARED_WORD_TAG_FORMAT: 'span.cleared',
		WORD_TAG_FORMAT: 'span',
		INPUT_WORD_TAG_FORMAT: 'input(type="text", maxlength=1)#inputword.text-center',
		HEADER_TAG_FORMAT: 'h1.text-container.text-center #{text}',
		CONTAINER_TAG_FORMAT: 'div.container',
		SCORE_TAG_FORMAT: 'p.score 0',
		el: 'body',

		clearedWordTag: null,
		wordTag: null,
		inputWordTag: null,
		scoreTag: null,

		getHeaderText: function () {
			return this.model.get('HEADER_TEXT');
		},

		onKeyPress: function (e) {
			// Check for the character and
			// sends it to the model to check
			// if it is the same, then fixes with
			// the cleared part and the non cleared.

			var word = null, splitIndex = 0;

			e.preventDefault();

			if (e.ctrlKey || e.charCode < 32) {
				return;
			}

			if (this.model.guessChar(String.fromCharCode(e.charCode).toLowerCase())) {
				splitIndex = this.model.get('currentLetterId');
				word = this.model.getCurrentWord();
				this.clearedWordTag.text(word.substr(0, splitIndex));
				this.wordTag.text(word.substr(splitIndex));
			}
		},

		onChangeWord: function () {
			// Event when word is changed in model.
			this.clearedWordTag.text('');
			this.wordTag.text(this.model.getCurrentWord());
		},

		events: {
			// Only reading for key input.
			'keypress input#inputword': 'onKeyPress'
		},

		initialize: function () {
			// Initializes and downloads the word list.
			this.listenTo(this.model, 'change:wordId', this.onChangeWord);

			// Makes "this"  the view and not the element on which the event runs on.
			_.bind(this.onKeyPress, this);
		},

		render: function () {
			// Adds container and adds to it a header and
			// a container containing cleared parts of the
			// word and the non cleared  parts and also adds
			// a input for reading.

			var jContainer = null, jHeader = null, jWordContainer = null,
				jCleared = null, jWord = null, jInputText = null, jScore = null,
				container = null, wordContainer = null;

			document.title = this.getHeaderText();

			jContainer = Jade.compile(this.CONTAINER_TAG_FORMAT);
			jHeader = Jade.compile(this.HEADER_TAG_FORMAT);
			jWordContainer = Jade.compile(this.WORD_CONTAINER_TAG_FORMAT);
			jCleared = Jade.compile(this.CLEARED_WORD_TAG_FORMAT);
			jWord = Jade.compile(this.WORD_TAG_FORMAT);
			jInputText = Jade.compile(this.INPUT_WORD_TAG_FORMAT);
			jScore  = Jade.compile(this.SCORE_TAG_FORMAT);

			container = $(jContainer());
			wordContainer = $(jWordContainer());
			this.clearedWordTag = $(jCleared());
			this.wordTag = $(jWord());
			this.inputWordTag = $(jInputText());
			this.scoreTag = $(jScore());

			container.append(jHeader({text: this.getHeaderText()}));
			wordContainer.append(this.clearedWordTag);
			wordContainer.append(this.wordTag);
			container.append(wordContainer);
			container.append(this.inputWordTag);
			container.append(this.scoreTag);
			this.$el.append(container);
		}
	});
});
