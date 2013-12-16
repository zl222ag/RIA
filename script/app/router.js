// © Zlatko Ladan 2013

// ## The Router
define([
	'backbone',
	'script/app/gameview.js',
	'script/app/gamemodel.js'
], function (Backbone, GameView, GameModel) {
	'use strict';

	return Backbone.Router.extend({
		gameView: null,
		gameModel: null,

		routes: {
			// Opens menu as default.
			'': 'index',

			// If play is chosen then, it's time to play.
			'play/:text': 'play',

			// If user opens non-existing route.
			'*invalid': 'invalid'
		},

		index: function () {
			// TODO this shouldn't be first choice.
			this.gameView.render();

			this.gameModel.getWordList();
		},

		play: function (a_mode) {
			// Letse GO!
			this.gameModel.set('mode', a_mode, {validate: true});
			this.gameView.render();

			this.gameModel.getWordList();
		},

		invalid: function () {
			// Navigates to "index".
			this.navigate('/', {trigger: true});
		},

		initialize: function () {
			// TODO view should be cleanable.
			// Initializes all of the components.
			this.gameModel = new GameModel({'router': this});
			this.gameView = new GameView({'model': this.gameModel});
			Backbone.history.start();
		}
	});
});
