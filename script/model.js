//© Zlatko Ladan 2013

// ## The Model
define(["backbone"], function (Backbone) {
	"use strict";
	return Backbone.Model.extend({
		text: 'The Insert Text Game!',
		words: null,

		keyPress: function (event) {
			return function (e) {
				if (!e.ctrlKey && /^[A-Z']$/i.test(String.fromCharCode(e.charCode))) {
					event(String.fromCharCode(e.charCode).toLowerCase());
				}
			};
		},

		getWordList: function (a_language) {
			var that = this;
			//downloads a word list, default language list is english.
			$.ajax({
				url: "wordlist." + (typeof a_language !== "string" ? "en" : a_language) + ".txt",
				dataType: "text",
				contentType: "text/plain; charset=utf-8",
				success: function (data) {
					that.words = data.trimLeft().trimRight().split(/\n+/);
				},
				error: function () {
					// get the default language list if is failes with a non default one
					if (a_language === null) {
						alert('Couldn\'t load the wordlist =(.');
					} else {
						that.getWordList();
					}
				}
			});
		},

		initialize: function () {
			//TODO ADD MENUES 'N' STUFF.
			var lang = navigator.language || navigator.userLanguage,
				index = lang.indexOf("-");

			if (index > 0) {
				lang = lang.substr(0, index);
			}
			this.getWordList(lang);
		}
	});
});
