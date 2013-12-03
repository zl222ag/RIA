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

		initialize: function () {
			//TODO ADD MENUES 'N' STUFF.
			/*var lang = navigator.language || navigator.userLanguage,
				index = lang.indexOf("-");*/
			var lang = "sv";
			/*if (index > 0) {
				lang = lang.substr(0, index);
			}*/

			$.ajax({
				url: "words." + lang + ".txt",
				dataType: "text",
				contentType: "text/plain; charset=utf-8",
				success: function (data) {
					this.words = data.trimLeft().trimRight().split(/\n+/);
					console.log(this.words.join("\n"));
				},
				done: function () {
				},
				error: function () {
					alert('Couldn\'t load the wordlist =(.');
				}
			});
		}
	});
});
