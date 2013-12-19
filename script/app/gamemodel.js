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
			errors: 0
		},

		MODE_FORMAT: /^(long|short|normal)$/i,
		NUMBER_OF_WORDS: 50,
		LANG_FORMAT: /^[a-z]{2}$/i,

		validate: function (a_attribs) {
			if (!(a_attribs.words instanceof Array)) {
				return 'model.words can only be a string array. Got: ' + a_attribs.words + '.';
			}
			// STORED HAS SAME TEST OF COURSE.
			if (!(a_attribs.storedWords instanceof Array)) {
				return 'model.words can only be a string array. Got: ' + a_attribs.storedWords + '.';
			}
			if (typeof a_attribs.wordId !== 'number' || a_attribs.wordId < 0 ||
					(
						a_attribs.wordId >= a_attribs.words.length &&
						a_attribs.wordId !== 0
					)
					) {
				return 'model.wordId cannot be less than 0 or greater than the size of model.words. Got: ' +
					a_attribs.wordId + '.';
			}
			// TODO test especially this one. ---/V
			if (typeof a_attribs.currentLetterId !== 'number' || a_attribs.currentLetterId < 0 ||
					(
						a_attribs.words.length > 0 &&
						a_attribs.currentLetterId > a_attribs.words[a_attribs.wordId].length
					)
					) {
				return 'model.currentLetterId cannot be less than 0 or greater than the length of the' +
					'current model.word (' + a_attribs.words[a_attribs.wordId].length + '). Got: ' +
					a_attribs.currentLetterId + '.';
			}
			if (typeof a_attribs.score !== 'number' || a_attribs.score < 0) {
				return 'model.score must be a number and cannot possibly lower than 0. Got a ' +
					typeof a_attribs.score + ' with value ' + a_attribs.score + '.';
			}
			if (typeof a_attribs.mode !== 'string' || !this.MODE_FORMAT.test(a_attribs.mode)) {
				this.trigger('modeerror', 'Invalid mode!');
				return 'model.error can only be in the right format!';
			}

			if (a_attribs.lang === null) {
				a_attribs.lang = a_attribs.DEFAULT_LANG;
			}

			if (typeof a_attribs.lang !== 'string' || !this.LANG_FORMAT.test(a_attribs.lang)) {
				return 'model.lang can only be null or contain only 2 letters. Got: ' + a_attribs.lang;
			}
			if (typeof a_attribs.errors !== 'number' || a_attribs.errors < 0) {
				return 'model.error can only a number greater than or equal to 0';
			}
		},

		getCurrentWord: function () {
			return this.get('words')[this.get('wordId')];
		},

		getScore: function () {
			return this.get('score');
		},

		addToScore: function (a_value) {
			this.set('score', this.get('score') + a_value);
		},

		getHighscore: function () {
			return this.get('highscore');
		},

		guessChar: function (a_char) {
			var index = this.get('currentLetterId');

			if (this.getCurrentWord()[index] !== a_char) {
				return false;
			}

			index += 1;

			// If cleared word!
			if (index >= this.getCurrentWord().length) {
				// Removes old word
				this.deletePastWord();

				// TODO add time to equation.
				this.addToScore(this.getCurrentWord().length * 2 / (this.get('errors') + 1));
				// If words are done and score is greater than high-score,
				// then update the new score.
				if (!this.pickWord() && this.getScore() > this.getHighscore()) {
					this.trigger('highscore', 'new high-score ' + this.getScore().toString() +
						', congratulations!');
				}
			} else {
				this.set('currentLetterId', index, {validate: true});
			}
			return true;
		},

		deletePastWord: function () {
			this.get('words').pop(this.get('wordId'));
		},

		pickWord: function () {
			// Selects a word from random, resets letter id.
			// Returns false if there is no list.
			var wordsLength = this.get('words').length;

			if (wordsLength < 1) {
				this.set('currentLetterId', 0);
				this.set('wordId', 0);
				return false;
			}
			this.set('currentLetterId', 0, {validate: true});
			this.set('wordId', Math.floor(Math.random() * wordsLength), {validate: true});
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
				that.set(
					'words',
					$.grep(
						WordList.trimLeft().trimRight().split(/\r\n|\r|\n/g),
						that.cleanArrayFilter
					),
					{validate: true}
				);
				that.pickWord();
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

		getStored: function (a_value) {
			if (typeof a_value !== 'string') {
				throw 'bacon';
			}
			return localStorage.getItem(a_value);
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
		}
	});
});
