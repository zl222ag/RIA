// © Zlatko Ladan 2013

// ## The Model
define(['backbone'], function (Backbone) {
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

		keyPress: function (a_event) {
			var that = this;

			return function (e) {
				var enteredChar = null;

				e.preventDefault();
				if (e.ctrlKey || e.charCode < 32) {
					return;
				}

				enteredChar = String.fromCharCode(e.charCode).toLowerCase();

				if (that.getCurrentWord()[that.get('currentLetterId')] === enteredChar) {
					a_event(enteredChar);
					that.set('currentLetterId', that.get('currentLetterId') + 1);

					if (that.get('currentLetterId') >= that.getCurrentWord().length) {
						that.deletePastWord();
						that.pickWord();
					}
				}
			};
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
			$.ajax({
				url: that.get('WORDLISTS_DIRECTORY') + that.get('lang') + that.get('WORDLIST_EXTENSION'),
				dataType: 'text',
				contentType: 'text/plain; charset=utf-8',
				success: function (a_data) {
					that.set('words', a_data.trimLeft().trimRight().split(/\n+/));
					that.pickWord();
				},
				error: function () {
					// Gets the default language list if is failes with a non default one
					if (that.get('lang') === that.get('DEFAULT_LANG')) {
						alert('Couldn\'t load the wordlist =(.');
					} else {
						that.set('lang', that.get('DEFAULT_LANG'));
						that.getWordList();
					}
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
			}
		}
	});
});
