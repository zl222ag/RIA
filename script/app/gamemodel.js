// © Zlatko Ladan 2013

// ## The Game Model
define(['backbone', 'text'], function (Backbone) {
	'use strict';

	return Backbone.Model.extend({
		defaults: {
			HEADER_TEXT: 'The Insert Text Game!',
			DEFAULT_LANG: 'en',
			WORDLISTS_DIRECTORY: 'wordlists/',
			WORDLIST_EXTENSION: '.txt',

			// Words is used from the current word list to read from.
			words: [],
			// The stored one is the one we will take from,
			// if mode is changed or language, then we will change it.
			storedWords: [],
			wordId: 0,
			currentLetterId: 0,
			score: 0,
			highscore: 0,
			mode: 'normal',
			lang: null,
			errors: 0,
			startTime: 0
		},

		INTEGER_FORMAT: /^[0-9]+$/,
		MODE_FORMAT: /^(long|short|normal)$/i,
		NUMBER_OF_WORDS: 50,
		LANG_FORMAT: /^[a-z]{2}$/i,

		validate: function (a_attribs) {
			if (!(a_attribs.words instanceof Array)) {
				return 'gamemodel.words can only be a string array. Got ' + typeof a_attribs.words + '.';
			}
			// STORED HAS SAME TEST OF COURSE.
			if (!(a_attribs.storedWords instanceof Array)) {
				return 'gamemodel.words can only be a string array. Got ' + typeof a_attribs.storedWords + '.';
			}
			if (typeof a_attribs.wordId !== 'number' || a_attribs.wordId < 0 ||
					(
						a_attribs.wordId >= a_attribs.words.length &&
						a_attribs.wordId !== 0
					)
					) {
				return 'gamemodel.wordId cannot be less than 0 or greater than the size of model.words. Got ' +
					typeof a_attribs.wordId +
					(typeof a_attribs.wordId === 'number' ? ' with value ' +
						a_attribs.wordId.toString() : ''
					) + '.';
			}
			if (typeof a_attribs.currentLetterId !== 'number' || a_attribs.currentLetterId < 0 ||
					(
						a_attribs.words.length > 0 &&
						a_attribs.currentLetterId > a_attribs.words[a_attribs.wordId].length
					)
					) {
				return 'gamemodel.currentLetterId cannot be less than 0 or greater than the length of the ' +
					'current model.word (' + a_attribs.words[a_attribs.wordId].length + '), got ' +
					typeof a_attribs.currentLetterId +
					(typeof a_attribs.currentLetterId === 'number' ? ' with value ' +
						a_attribs.currentLetterId.toString() : ''
					) + '.';
			}
			if (typeof a_attribs.score !== 'number' || a_attribs.score < 0) {
				return 'gamemodel.score must be a number and cannot possibly lower than 0, got ' +
					typeof a_attribs.score + (typeof a_attribs.score === 'number' ? ' with value ' +
						a_attribs.score.toString() : ''
					) + '.';
			}
			if (typeof a_attribs.highscore !== 'number' || a_attribs.highscore < 0) {
				return 'gamemodel.highscore must be a number and cannot possibly lower than 0, got ' +
					typeof a_attribs.highscore + (typeof a_attribs.highscore === 'number' ? ' with value ' +
						a_attribs.highscore.toString() : ''
					) + '.';
			}
			if (typeof a_attribs.mode !== 'string' || !this.MODE_FORMAT.test(a_attribs.mode)) {
				this.trigger('modeerror', 'Invalid mode!');
				return 'gamemodel.error can only be in the right format!';
			}

			if (a_attribs.lang === null) {
				a_attribs.lang = a_attribs.DEFAULT_LANG;
			}

			if (typeof a_attribs.lang !== 'string' || !this.LANG_FORMAT.test(a_attribs.lang)) {
				return 'gamemodel.lang can only be null or contain only 2 letters, got ' +
					typeof a_attribs.lang +
					(typeof a_attribs.lang === 'string' ? ' with length' +
						a_attribs.lang.length.toString() : ''
					) + '.';
			}
			if (typeof a_attribs.errors !== 'number' || a_attribs.errors < 0) {
				return 'gamemodel.error can only a number greater than or equal to 0, got ' +
					typeof a_attribs.errors + (typeof a_attribs.errors === 'number' ? ' with value ' +
						a_attribs.errors.toString() : ''
					) + '.';
			}
			if (typeof a_attribs.startTime !== 'number' || a_attribs.startTime < 0) {
				return 'gamemodel.startTime can only a number greater than or equal to 0, got ' +
					typeof a_attribs.startTime + (typeof a_attribs.startTime === 'number' ? ' with value ' +
						a_attribs.startTime.toString() : ''
					) + '.';
			}
		},

		getCurrentWord: function () {
			// Does what it is called.
			return this.get('words')[this.get('wordId')];
		},

		getScore: function () {
			// Does what it is called.
			return this.get('score');
		},

		addToScore: function (a_value) {
			// Does what it is called.
			this.set('score', this.get('score') + a_value, {validate: true});
		},

		getHighscore: function () {
			// Does what it is called.
			return this.get('highscore');
		},

		guessChar: function (a_char) {
			// Does what it is called.
			var index = this.get('currentLetterId'), elapsedTime = 0;

			if (this.getCurrentWord()[index] !== a_char) {
				return false;
			}

			index += 1;

			// If cleared word!
			if (index >= this.getCurrentWord().length) {
				elapsedTime = new Date().getTime() - this.get('startTime');
				this.addToScore(
					Math.floor((this.getCurrentWord().length * 2) /
						(this.get('errors') + Math.floor(elapsedTime / 1000) + 1))
				);

				// Removes old word
				this.deletePastWord();

				// If words are done and score is greater than high-score,
				// then update the new score.
				if (!this.pickWord()) {
					if (this.getScore() > this.getHighscore()) {
						this.trigger('beat-highscore', 'New high-score ' + this.getScore().toString() +
							', congratulations!');
						this.set('highscore', this.getScore(), {validate: true});
					} else {
						this.trigger('beat-highscore', 'Not a new high-score ' + this.getScore().toString() +
							', congratulations!');
					}
					this.trigger('finishedgame');
				}
			} else {
				this.set('currentLetterId', index, {validate: true});
			}
			return true;
		},

		startNewGame: function () {
			var i = 0, len = 0, tmpAll = null, tmpWords = [];

			switch (this.get('mode')) {
			case 'long':
				this.set({
					'words': this.get('storedWords').slice(-this.NUMBER_OF_WORDS),
					'currentLetterId': 0
				}, {validate: true});
				break;

			case 'short':
				this.set({
					'words': this.get('storedWords').slice(0, this.NUMBER_OF_WORDS),
					'currentLetterId': 0
				}, {validate: true});
				break;

			default: // 'normal'
				// Adds random words!
				tmpAll = this.get('storedWords');
				for (i = 0, len = this.NUMBER_OF_WORDS; i < len; i += 1) {
					tmpWords.push(tmpAll.slice(Math.floor(Math.random() * tmpAll.length, 1))[0]);
				}
				this.set({
					'words': tmpWords,
					'currentLetterId': 0
				}, {validate: true});
			}
			this.pickWord();
		},

		deletePastWord: function () {
			// Does what it is called.
			this.get('words').splice(this.get('wordId'), 1);
		},

		pickWord: function () {
			// Selects a word from random, resets letter id.
			// Returns false if there is no list.
			var wordsLength = this.get('words').length;

			if (wordsLength < 1) {
				this.set({
					'wordId': 0,
					'currentLetterId': 0,
					'startTime': 0
				}, {validate: true});
				return false;
			}
			this.set({
				'wordId': Math.floor(Math.random() * wordsLength),
				'currentLetterId': 0,
				'startTime': new Date().getTime()
			}, {validate: true});
			return true;
		},

		getWordList: function () {
			// Downloads a word list, default language list is English.
			var that = this;

			require([
				'text!' +
					this.get('WORDLISTS_DIRECTORY') +
					this.get('lang') +
					this.get('WORDLIST_EXTENSION') +
					'!strip'
			], function (WordList) {
				// \r? because easyPHP or windows, very grozno.
				// atleast i won't bang my head against the wall anymore, THANKS.
				that.listenToOnce(that, 'change:storedWords', function () {
					this.trigger('wordsLoaded');
				});
				that.set(
					'storedWords',
					$.grep(
						WordList.trimLeft().trimRight().split(/\r\n|\r|\n/g),
						that.cleanArrayFilter
					),
					{validate: true}
				);
			}, function () {
				// Gets the default language list if is fails with a non default one
				if (that.get('lang') === that.get('DEFAULT_LANG')) {
					alert('Couldn\'t load the wordlist =(.');
				} else {
					that.set('lang', that.get('DEFAULT_LANG'), {validate: true});
					that.getWordList();
				}
			});
		},

		cleanArrayFilter: function (a_value) {
			return typeof a_value === 'string' && a_value.length > 0;
		},

		getStored: function (a_key) {
			if (typeof a_key !== 'string' || a_key.length < 1) {
				throw 'gamemodel setStored\'s parameter a_key must be a string greater than or equal to 1, got ' +
					typeof a_key + '.';
			}
			return window.localStorage.getItem(a_key);
		},

		setStored: function (a_key, a_value) {
			if (typeof a_key !== 'string' || a_key.length < 1) {
				throw 'gamemodel setStored\'s parameter a_key must be a string greater than or equal to 1, got ' +
					typeof a_key + '.';
			}
			return window.localStorage.setItem(a_key, a_value);
		},

		parseInteger: function (a_value) {
			if (typeof a_value !== 'string' || !this.INTEGER_FORMAT.test(a_value)) {
				console.error(
					'gamemodel parseint\'s parameter a_value must be a string in the correct integer format' +
						'got ' + typeof a_value +
						(typeof a_value === 'string' ? 'with value ' + a_value + '.' : '')
				);
				return 0;
			}
			return window.parseInt(a_value);
		},

		initialize: function () {
			// Initializes, finds out the language and sets it.
			var index = 0, lang = null;

			lang = navigator.language || navigator.userLanguage;
			index = lang.indexOf('-');

			if (index > 0) {
				this.set('lang', lang.substr(0, index), {validate: true});
			} else {
				this.set('lang', lang, {validate: true});
			}
			this.set('highscore', this.parseInteger(this.getStored('highscore')), {validate: true});
			this.listenTo(this, 'invalid', function (a_model, a_text) {
				console.error(a_text);
			});
		}
	});
});
