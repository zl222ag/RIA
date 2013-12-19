// © Zlatko Ladan 2013

// ## The Router
define([
	'backbone',
	'script/app/menuview.js',
	'script/app/gameview.js',
	'script/app/gamemodel.js'
], function (Backbone, MenuView, GameView, GameModel) {
	'use strict';

	return Backbone.Router.extend({
		gameView: null,
		gameModel: null,
		menuView: null,
		invalidMode: false,

		routes: {
			// Opens menu as default.
			'': 'index',

			// If play is chosen then, it's time to play.
			'play/:text': 'play',

			// If user opens non-existing route.
			'*invalid': 'invalid'
		},

		index: function () {
			if (!this.menuView.getIsRendered()) {
				this.menuView.render();
			}
			this.menuView.setIsInGame(false);
		},

		play: function (a_mode) {
			// Letse GO!
			this.gameModel.set('mode', a_mode, {validate: true});
			if (!this.menuView.getIsRendered()) {
				this.menuView.render();
			}
			if (!this.gameView.getIsRendered()) {
				this.gameView.render();
			}
			if (!this.invalidMode) {
				this.menuView.setIsInGame(true);

				this.gameModel.getWordList();
			} else {
				this.invalidMode = false;
			}
		},

		invalid: function () {
			// Navigates to "index".
			alert("Sorry, redirecting you to menu.\nYOU'VE made a mistake.");
			this.invalidMode = true;
			this.menuView.setIsInGame(false);
			this.navigate('/', {trigger: true});
		},

		onLocationChange: function (a_location) {
			this.navigate(a_location, {trigger: true});
		},

		initialize: function () {
			// TODO view should be cleanable.
			// Initializes all of the components.
			this.gameModel = new GameModel({'router': this});
			this.gameView = new GameView({'model': this.gameModel});
			this.menuView = new MenuView();
			this.listenTo(this.gameModel, "modeerror", this.invalid);
			this.listenTo(this.menuView, "location", this.onLocationChange);
			Backbone.history.start();
		}
	});
});
