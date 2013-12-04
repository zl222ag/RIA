// © Zlatko Ladan 2013

// ## The Model
define(["backbone"], function (Backbone) {
	"use strict";
	return Backbone.Model.extend({
		HEADER_TEXT: 'The Insert Text Game!',
		DEFAULT_LANG: "en",
		WORDLISTS_DIRECTORY: "wordlists/",
		WORDLIST_EXTENSION: ".txt",
		CHAR_FORMAT: /^[a-z'\-]$/,

		words: null,
		wordId: 0,
		currentLetterId: 0,
		score: 0,
		lang: null,

		getCurrentWord: function () {
			return this.words[this.wordId];
		},

		keyPress: function (event) {
			var that = this;
			return function (e) {
				var enteredChar = null;

				if (e.ctrlKey) {
					return;
				}

				enteredChar = String.fromCharCode(e.charCode).toLowerCase();

				if (
					that.CHAR_FORMAT.test(enteredChar) &&
						that.getCurrentWord()[that.currentLetterId] === enteredChar
				) {
					event(enteredChar);
					that.currentLetterId += 1;

					if (that.currentLetterId >= that.getCurrentWord().length) {
						that.deletePastWord();
						that.pickWord();
					}
				}
			};
		},

		deletePastWord: function () {
			this.words.pop(this.wordId);
		},

		pickWord: function () {
			this.wordId = Math.floor(Math.random() * this.words.length);
			this.currentLetterId = 0;
		},

		getWordList: function (a_onDone) {
			var that = this;
			// Downloads a word list, default language list is english.
			$.ajax({
				url: that.WORDLISTS_DIRECTORY + that.lang + that.WORDLIST_EXTENSION,
				dataType: "text",
				contentType: "text/plain; charset=utf-8",
				success: function (data) {
					that.words = data.trimLeft().trimRight().split(/\n+/);
					that.pickWord();
					a_onDone();
				},
				error: function () {
					// Gets the default language list if is failes with a non default one
					if (that.lang === that.DEFAULT_LANG) {
						alert('Couldn\'t load the wordlist =(.');
					} else {
						that.lang = that.DEFAULT_LANG;
						that.getWordList();
					}
				}
			});
		},

		initialize: function () {
			// TODO: ADD MENUES 'N' STUFF.
			var index = 0;
			this.lang = navigator.language || navigator.userLanguage;
			index = this.lang.indexOf("-");

			if (index > 0) {
				this.lang = this.lang.substr(0, index);
			}
		}
	});
});
