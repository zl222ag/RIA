// © Zlatko Ladan 2013

// ## The Model
define(['backbone', 'text'], function (Backbone) {
	'use strict';

	return Backbone.Model.extend({
		defaults: {
			HEADER_TEXT: 'The Insert Text Game!',
			DEFAULT_LANG: 'en',
			WORDLISTS_DIRECTORY: 'wordlists/',
			WORDLIST_EXTENSION: '.txt',

			words: [],
			wordId: 0,
			currentLetterId: 0,
			score: 0,
			lang: null
		},

		LANG_FORMAT: /^[a-z]{2}$/,

		validate: function (a_attribs) {
			//TODO: test
			if (!(a_attribs.words instanceof Array)) {
				return 'model.words can only be a string array. Got: ' + a_attribs.words + '.';
			}
			if (a_attribs.wordId < 0 || (a_attribs.wordId >= a_attribs.words.length && a_attribs.wordId !== 0)) {
				return 'model.wordId cannot be less than 0 or greater than the size of model.words. Got: ' + a_attribs.wordId + '.';
			}
			//TODO: test especially this one. ---/V
			if (a_attribs.currentLetterId < 0 || (a_attribs.words.length > 0 && a_attribs.currentLetterId > a_attribs.words[a_attribs.wordId].length)) {
				return 'model.currentLetterId cannot be less than 0 or greater than the length of the current model.word (' + a_attribs.words[a_attribs.wordId].length + '). Got: ' + a_attribs.currentLetterId + '.';
			}
			if (a_attribs.score < 0) {
				return 'model.score cannot possibly be lower than 0. Got: ' + a_attribs.score + '.';
			}
			// TODO: FIX THAT THING DOWN THERE, UNCOMMENT.
			/*
			if (a_attribs.lang !== null && this.LANG_FORMAT.test(a_attribs.lang)) {
				return 'model.lang can only be null or contain only 2 letters. Got: ' + a_attribs.lang;
			}*/
		},

		getCurrentWord: function () {
			return this.get('words')[this.get('wordId')];
		},

		guessChar: function (a_char) {
			var index = this.get('currentLetterId');

			if (this.getCurrentWord()[index] !== a_char) {
				return false;
			}

			index += 1;

			if (index >= this.getCurrentWord().length) {
				this.deletePastWord();
				this.pickWord();
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
			this.set('currentLetterId', 0, {validate: true});
			this.set('wordId', Math.floor(Math.random() * this.get('words').length), {validate: true});
		},

		getWordList: function () {
			// Downloads a word list, default language list is English.
			var that = this;

			require(['text!' + this.get('WORDLISTS_DIRECTORY') + this.get('lang') + this.get('WORDLIST_EXTENSION') + '!strip'], function (WordList) {
				that.set('words', WordList.trimLeft().trimRight().split(/\n+/), {validate: true});
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

		initialize: function () {
			// Initializes, finds out the language and sets it.
			var index = 0, lang = null;

			this.on('invalid', function (a_model, a_error) {
				// TODO: PLZ REMOVE ME SOON.
				alert('Error: ' + a_error);
			});

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
