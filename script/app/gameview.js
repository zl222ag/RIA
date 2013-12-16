// © Zlatko Ladan 2013

// ## The View
define(['backbone', 'jade'], function (Backbone, Jade) {
	'use strict';

	return Backbone.View.extend({
		WORD_CONTAINER_TAG_FORMAT: 'div.text-center',
		CLEARED_WORD_TAG_FORMAT: 'span.cleared',
		WORD_TAG_FORMAT: 'span',
		INPUT_WORD_TAG_FORMAT: 'input(type="text", maxlength=5)#inputword.text-center',
		HEADER_TAG_FORMAT: 'h1.text-container.text-center #{text}',
		CONTAINER_TAG_FORMAT: 'div.container',
		STATUS_TAG_FORMAT: 'div.status\n\tspan.glyphicon.glyphicon-info-sign',
		SCORE_TEXT_TAG_FORMAT: 'span.score 0',
		el: 'body',

		clearedWordTag: null,
		wordTag: null,
		inputWordTag: null,
		statusTag: null,
		scoreNode: null,
		keysDown: {},

		getHeaderText: function () {
			return this.model.get('HEADER_TEXT');
		},

		onKeyDown: function (e) {
		},

		onKeyUp: function (e) {
			// Check for the first character and
			// removes it from input so that the
			// sends it to the model to check
			// if it is the same, then fixes with
			// the cleared part and the non cleared.

			var word = null, splitIndex = 0, lastChar = null;

			e.preventDefault();

			if (e.ctrlKey) {
				return;
			}

			lastChar = this.inputWordTag.val().substr(0, 1).toLowerCase();

			this.inputWordTag.val(this.inputWordTag.val().substr(1));

			if (this.model.guessChar(lastChar)) {
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

		onChangeScore: function () {
			// Event when score is changed in model.
			this.scoreNode.nodeValue = this.model.getScore().toString();
		},

		onNewHighScore: function (a_message) {
			// Event when new high-score has been reached.
			// TODO REPLACE THIS WITH SOMETHING NICER
			alert(a_message);
		},

		onInvalid: function (a_callee, a_message) {
			alert(a_message);
		},

		events: {
			// Only reading for key input.
			'keyup input#inputword': 'onKeyUp',
			'keydown input#inputword': 'onKeyDown'
		},

		initialize: function () {
			// Initializes and downloads the word list.
			this.listenTo(this.model, 'change:wordId', this.onChangeWord);
			this.listenTo(this.model, 'change:score', this.onChangeScore);
			this.listenTo(this.model, 'highscore', this.onNewHighScore);
			this.listenTo(this.model, 'invalid', this.onInvalid);

			// Makes "this"  the view and not the element on which the event runs on.
			_.bind(this.onKeyUp, this);
		},

		render: function () {
			// Adds container and adds to it a header and
			// a container containing cleared parts of the
			// word and the non cleared  parts and also adds
			// a input for reading.

			var jContainer = null, jHeader = null, jWordContainer = null,
				jCleared = null, jWord = null, jInputText = null, jStatus = null,
				jScore = null, container = null, wordContainer = null, scoreTag = null;

			document.title = this.getHeaderText();

			jContainer = Jade.compile(this.CONTAINER_TAG_FORMAT);
			jHeader = Jade.compile(this.HEADER_TAG_FORMAT);
			jWordContainer = Jade.compile(this.WORD_CONTAINER_TAG_FORMAT);
			jCleared = Jade.compile(this.CLEARED_WORD_TAG_FORMAT);
			jWord = Jade.compile(this.WORD_TAG_FORMAT);
			jInputText = Jade.compile(this.INPUT_WORD_TAG_FORMAT);
			jStatus = Jade.compile(this.STATUS_TAG_FORMAT);
			jScore = Jade.compile(this.SCORE_TEXT_TAG_FORMAT);

			container = $(jContainer());
			wordContainer = $(jWordContainer());
			this.clearedWordTag = $(jCleared());
			this.wordTag = $(jWord());
			this.inputWordTag = $(jInputText());
			this.statusTag = $(jStatus());
			scoreTag = $(jScore());
			// Gets the text node from score element.
			this.scoreNode = scoreTag.contents().eq(0)[0];

			container.append(jHeader({text: this.getHeaderText()}));
			wordContainer.append(this.clearedWordTag);
			wordContainer.append(this.wordTag);
			this.statusTag.append(scoreTag);
			container.append(wordContainer);
			container.append(this.inputWordTag);
			container.append(this.statusTag);
			this.$el.append(container);

			return this;
		}
	});
});
