// © Zlatko Ladan 2013

// ## The Game Menu View
define(['backbone', 'jade'], function (Backbone, Jade) {
	'use strict';

	return Backbone.View.extend({
		defaults: {
			rendered: false
		},

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

		getIsRendered: function () {
			return this.isRendered;
		},

		setIsRendered: function (a_value) {
			if (typeof a_value !== 'boolean') {
				throw 'bacon';
			}
			this.isRendered = a_value;
		},

		setIsInGame: function (a_value) {
			if (typeof a_value !== 'boolean') {
				throw 'bacon';
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
				throw 'bacon';
			}
			if (typeof a_href !== 'string' || a_text.length < 1) {
				throw 'bacon';
			}

			if (a_inGame === undefined) {
				a_inGame = false;
			}

			if (typeof a_inGame !== 'boolean') {
				throw 'bacon';
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
			this.setIsRendered(true);

			return this;
		}
	});
});
