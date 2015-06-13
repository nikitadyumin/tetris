/**
 * Created by ndyumin on 28.05.2015.
 * @exports GameOverView
 */

define(function (require) {
    var Backbone = require('backbone'),
        Handlebars = require('handlebars');

    var template = require('raw!../templates/gameover.hbs'),
        hbTemplate = Handlebars.compile(template);

    var GameOverView = Backbone.View.extend(/** @lends GameOverView.prototype */{
        el: 'div#modal',
        template: hbTemplate,
        /**
         *
         * @param app
         * @param gameModel
         */
        initialize: function (app, gameModel) {
            this.app = app;
            this.gameModel = gameModel;
            this.$el.on('hide.bs.modal', this.dispose.bind(this));
            this.render();
        },

        render: function() {
            var score = this.gameModel.get('score');
            this.$el
                .empty()
                .append(this.template({score: score}));
            $(this.el).modal('show');
        },

        dispose: function() {
            this.$el.off();
            this.gameModel = null;
        }
    });

    return GameOverView;
});