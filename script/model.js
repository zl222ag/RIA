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

			words: null,
			wordId: 0,
			currentLetterId: 0,
			score: 0,
			lang: null
		},

		getCurrentWord: function () {
			return this.get('words')[this.get('wordId')];
		},

		validate: function () {
		},

		guessChar: function (a_char) {
			if (this.getCurrentWord()[this.get('currentLetterId')] !== a_char) {
				return false;
			}

			this.set('currentLetterId', this.get('currentLetterId') + 1);

			if (this.get('currentLetterId') >= this.getCurrentWord().length) {
				this.deletePastWord();
				this.pickWord();
			}
			return true;
		},

		deletePastWord: function () {
			this.get('words').pop(this.get('wordId'));
		},

		pickWord: function () {
			this.set('wordId', Math.floor(Math.random() * this.get('words').length));
			this.set('currentLetterId', 0);
		},

		getWordList: function () {
			var that = this;
			// Downloads a word list, default language list is english.
			require(['text!' + this.get('WORDLISTS_DIRECTORY') + this.get('lang') + this.get('WORDLIST_EXTENSION') + '!strip'], function (WordList) {
				that.set('words', WordList.trimLeft().trimRight().split(/\n+/));
				that.pickWord();
			}, function () {
				// Gets the default language list if is failes with a non default one
				if (that.get('lang') === that.get('DEFAULT_LANG')) {
					alert('Couldn\'t load the wordlist =(.');
				} else {
					that.set('lang', that.get('DEFAULT_LANG'));
					that.getWordList();
				}
			});
		},

		initialize: function () {
			// TODO: ADD MENUES 'N' STUFF.
			var index = 0, lang = null;

			lang = navigator.language || navigator.userLanguage;
			index = lang.indexOf('-');

			if (index > 0) {
				this.set('lang', lang.substr(0, index));
			} else {
				this.set('lang', lang);
			}
		}
	});
});
