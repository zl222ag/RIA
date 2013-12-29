// © Zlatko Ladan 2013

// ## The Game Menu View
define(['backbone', 'jade'], function (Backbone, Jade) {
	'use strict';

	return Backbone.View.extend({
		MENU_FORMAT: 'ul.list-unstyled#gamemenu',
		MENU_ITEM_FORMAT: 'li(class=role?"ingame":"")\n\ta(href="#",location=locat).btn.btn-default #{text}',
		el: 'div#wrapper',
		jMenuItem: null,
		menu: null,
		menuItems: [],

		onClick: function (e) {
			e.preventDefault();
			this.trigger('location', e.target.getAttribute('location'));
		},

		setIsInGame: function (a_value) {
			if (typeof a_value !== 'boolean') {
				throw 'menuview.isInGame must be a boolean, got ' + typeof a_value + '.';
			}

			if (a_value) {
				this.$el.addClass('game');
			} else {
				this.$el.removeClass('game');
			}
		},

		addMenuItem: function (a_text, a_href, a_inGame) {
			var menuItem = null;
			if (typeof a_text !== 'string' || a_text.length < 1) {
				throw 'gameview\'s function addMenuItem parameter a_text must be a string with lenght 1' +
					' or greater, got ' + typeof a_text +
					(typeof a_text === 'string' ? ' with length' + a_text.length.toString() : '') + '.';
			}
			if (typeof a_href !== 'string' || a_href.length < 1) {
				throw 'gameview\'s function addMenuItem parameter a_href must be a string with lenght 1' +
					'or greater, got ' + typeof a_href +
					(typeof a_href === 'string' ? ' with length' + a_href.length.toString() : '') + '.';
			}

			if (a_inGame === undefined) {
				a_inGame = false;
			}

			if (typeof a_inGame !== 'boolean') {
				throw 'gameview.addMenuItem\'s a_inGame must be a boolean, got ' + typeof a_inGame + '.';
			}
			menuItem = $(this.jMenuItem({'text': a_text, 'locat': a_href, 'role': a_inGame}));
			this.menu.append(menuItem);
			this.menuItems.push(menuItem);
		},

		events: {
			'click #gamemenu a': 'onClick'
		},

		initialize: function () {
			this.jMenuItem = Jade.compile(this.MENU_ITEM_FORMAT);
			_.bind(this.onClick, this);
		},

		render: function () {
			this.menu = $(Jade.compile(this.MENU_FORMAT)());
			this.addMenuItem('Short Words', 'play/short');
			this.addMenuItem('Normal Words', 'play/normal');
			this.addMenuItem('Long Words', 'play/long');
			this.addMenuItem('Back', '/', true);
			this.$el.append(this.menu);

			return this;
		}
	});
});
