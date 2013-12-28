// © Zlatko Ladan 2013

// ## The Game View
define(['backbone', 'jade'], function (Backbone, Jade) {
	'use strict';

	return Backbone.View.extend({
		ACCEPTABLE_CHAR_INDEX: 65,
		WORD_CONTAINER_TAG_FORMAT: 'div.text-center',
		CLEARED_WORD_TAG_FORMAT: 'span.cleared',
		WORD_TAG_FORMAT: 'span',
		INPUT_WORD_TAG_FORMAT: 'input(type="text", maxlength=5, autocapitalize="off", ' +
								'autocorrect="off", autocomplete="off")#inputword.text-center',
		HEADER_TAG_FORMAT: 'h1.text-container.text-center #{text}',
		CONTAINER_TAG_FORMAT: 'div.container',
		STATUS_TAG_FORMAT: 'div.status\n\tspan.glyphicon.glyphicon-info-sign',
		SCORE_TEXT_TAG_FORMAT: 'span.score 0',
		HIGHSCORE_TEXT_TAG_FORMAT: 'span.highscore 0',
		WORD_TEXT_TAG_FORMAT: 'span.word -1/314',
		el: 'div#wrapper',

		clearedWordTag: null,
		wordTag: null,
		inputWordTag: null,
		statusTag: null,
		scoreNode: null,
		wordNode: null,
		rendered: false,
		keysDown: {},

		getHeaderText: function () {
			return this.model.get('HEADER_TEXT');
		},

		getIsRendered: function () {
			// Has the view been rendered?
			return this.isRendered;
		},

		setIsRendered: function (a_value) {
			// Sets if the view been rendered?
			if (typeof a_value !== 'boolean') {
				throw 'gameview.isRendered must be a boolean, got ' + typeof a_value + '.';
			}
			this.isRendered = a_value;
		},

		onKeyDown: function (e) {
			// Only adds character if it's
			// "valid" and has not been added
			// already.

			// Ugly fix for mobile
			if (e.keyCode === 0) {
				return false;
			}
			if (e.ctrlKey || e.keyCode < this.ACCEPTABLE_CHAR_INDEX ||
					this.keysDown[e.keyCode.toString()] === true
					) {
				return false;
			}
			this.keysDown[e.keyCode.toString()] = true;
		},

		onKeyUp: function (e) {
			// Check for the first character and
			// removes it from input so that the
			// sends it to the model to check
			// if it is the same, then fixes with
			// the cleared part and the non cleared.

			var word = null, splitIndex = 0, lastChar = null;

			e.preventDefault();

			// Ugly fix for mobile && (the rest)
			if (e.keyCode !== 0 && (e.ctrlKey || e.keyCode < this.ACCEPTABLE_CHAR_INDEX)) {
				return false;
			}

			this.keysDown[e.keyCode.toString()] = false;

			lastChar = this.inputWordTag.val().substr(0, 1).toLowerCase();

			this.inputWordTag.val(this.inputWordTag.val().substr(1));

			if (this.model.guessChar(lastChar)) {
				splitIndex = this.model.get('currentLetterId');
				word = this.model.getCurrentWord();
				if (word !== undefined) {
					this.clearedWordTag.text(word.substr(0, splitIndex));
					this.wordTag.text(word.substr(splitIndex));
				}
			}
		},

		selectionKiller: function (e) {
			// Since user will not be able to selet
			// we must prevent default which disables
			// focus, it's therefore called manually.
			// Doesn't work for mobile devices

			e.target.focus();
			e.preventDefault();
		},

		onChangeWord: function () {
			// Event when word is changed in model.
			this.clearedWordTag.text('');
			this.wordTag.text(this.model.getCurrentWord());
			this.wordNode.nodeValue = (
				this.model.NUMBER_OF_WORDS - this.model.get('words').length + 1
			).toString() +
				'/' + this.model.NUMBER_OF_WORDS.toString();
		},

		onChangeScore: function () {
			// Event when score is changed in model.
			this.scoreNode.nodeValue = this.model.getScore().toString();
		},

		onChangeHighscore: function () {
			// Event when highscore is changed in model.
			this.highscoreNode.nodeValue = this.model.getHighscore().toString();
		},

		onNewHighScore: function (a_message) {
			// Event when new high-score has been reached.
			// TODO: REPLACE THIS WITH SOMETHING NICER
			alert(a_message);
		},

		events: {
			// Only reading for key input.
			'keydown input#inputword': 'onKeyDown',
			'keyup input#inputword': 'onKeyUp',
			'mousedown input#inputword': 'selectionKiller'
		},

		initialize: function () {
			// Initializes and downloads the word list.
			this.listenTo(this.model, 'change:wordId', this.onChangeWord);
			this.listenTo(this.model, 'change:score', this.onChangeScore);
			this.listenTo(this.model, 'change:highscore', this.onChangeHighscore);
			this.listenTo(this.model, 'beat-highscore', this.onNewHighScore);

			// Makes "this"  the view and not the element on which the event runs on.
			_.bind(this.onKeyUp, this);
			_.bind(this.onKeyDown, this);
		},

		render: function () {
			// Adds container and adds to it a header and
			// a container containing cleared parts of the
			// word and the non cleared  parts and also adds
			// a input for reading.

			var jHeader = null, jContainer = null, container = null, jWordContainer = null,
				jCleared = null, jWord = null, jInputText = null, jStatus = null,
				jScore = null, jHighscore = null, jWordStatus = null, wordContainer = null,
				scoreTag = null, highscoreTag = null, wordStatusTag = null;

			document.title = this.getHeaderText();

			jHeader = Jade.compile(this.HEADER_TAG_FORMAT);
			jContainer = Jade.compile(this.CONTAINER_TAG_FORMAT);
			jWordContainer = Jade.compile(this.WORD_CONTAINER_TAG_FORMAT);
			jCleared = Jade.compile(this.CLEARED_WORD_TAG_FORMAT);
			jWord = Jade.compile(this.WORD_TAG_FORMAT);
			jInputText = Jade.compile(this.INPUT_WORD_TAG_FORMAT);
			jStatus = Jade.compile(this.STATUS_TAG_FORMAT);
			jScore = Jade.compile(this.SCORE_TEXT_TAG_FORMAT);
			jHighscore = Jade.compile(this.HIGHSCORE_TEXT_TAG_FORMAT);
			jWordStatus = Jade.compile(this.WORD_TEXT_TAG_FORMAT);

			wordContainer = $(jWordContainer());
			container = $(jContainer());
			this.clearedWordTag = $(jCleared());
			this.wordTag = $(jWord());
			this.inputWordTag = $(jInputText());
			this.statusTag = $(jStatus());
			scoreTag = $(jScore());
			highscoreTag = $(jHighscore());
			wordStatusTag = $(jWordStatus());
			// Gets the text node from (high)score element.
			this.scoreNode = scoreTag.contents().eq(0)[0];
			this.highscoreNode = highscoreTag.contents().eq(0)[0];
			this.wordNode = wordStatusTag.contents().eq(0)[0];

			this.$el.prepend(jHeader({text: this.getHeaderText()}));
			wordContainer.append(this.clearedWordTag);
			wordContainer.append(this.wordTag);
			this.statusTag.append(scoreTag);
			this.statusTag.append(highscoreTag);
			this.statusTag.append(wordStatusTag);
			container.append(wordContainer);
			container.append(this.inputWordTag);
			container.append(this.statusTag);
			this.$el.append(container);
			this.setIsRendered(true);

			return this;
		}
	});
});
