/**
 * Created by nikita on 24.05.2015.
 *
 * @exports MenuView
 */

define(function (require) {
    var Backbone = require('backbone'),
        Handlebars = require('handlebars'),
        Wreqr = require('backbone.wreqr'),
        $ = require('jquery');

    var menu_template = require('raw!./templates/menu.hbs');
    var globalBus = Wreqr.radio.channel('global');

    var MenuView = Backbone.View.extend(/** @lends MenuView.prototype */{
        el: 'header',

        template: Handlebars.compile(menu_template),

        events: {
            'click li > a': 'onMenuItemClick'
        },
        /**
         *
         * @param app
         */
        initialize: function (app) {
            this.app = app;
            this.items = new Backbone.Collection();
            this.listenTo(this.items, 'reset', this.render);
            this.items.reset([
                {"name": "New game", "action": "newgame:human"},
                {"name": "New game(AI)", "action": "newgame:ai"}
            ]);
        },
        /**
         *
         */
        render: function () {
            var menuItems = this.template({items: this.items.toJSON()});
            this.$el.html(menuItems);
        },
        /**
         *
         * @private
         */
        _hidePopup: function() {
            var $menuButton = $(".navbar-toggle");
            if ($menuButton.is(':visible')) {
                $menuButton.click();
            }
        },
        /**
         * menu click handler
         * @param {object} e
         */
        onMenuItemClick: function (e) {
            e.preventDefault();
            this._hidePopup();

            var $target = $(e.target);
            $target.closest('ul').find('li').removeClass('active');
            var action = $target.attr('data-action');
            if (action) {
                $target.closest('li').addClass('active');
                var actionPair = action.split(':');
                globalBus.vent.trigger(actionPair[0], actionPair[1]);
            }
        },

        dispose: function () {
            this.undelegateEvents();
            this.stopListening();
            this.app = this.items = null;
        }
    });

    return MenuView;
});
