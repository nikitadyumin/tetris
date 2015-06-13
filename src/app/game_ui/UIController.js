/**
 * Created by ndyumin on 29.05.2015.
 */
define(function (require) {
    var Wreqr = require('backbone.wreqr');
    var Backbone = require('backbone');
    var gameBus = Wreqr.radio.channel('game');

    var FieldView = require('./views/FieldView'),
        GameOverView = require('./views/GameOverView'),
        GameController = require('../game/GameController'),
        AI = require('../game/AIController'),
        KeyboardController = require('../input/KeyboardController');

    var FPS = 30,
        UPDATE_FRAME = (1000 / FPS) | 0;

    function UIController(app) {
        this.app = app;
        this.keyboard = new KeyboardController();
        gameBus.vent.on('start', this.onGameStarted, this);
        gameBus.vent.on('end', this.onGameEnded, this);
        gameBus.vent.on('collapse', this.onRowCollapsed, this);
    }

    UIController.prototype = {
        /**
         * @type {FieldView}
         */
        view: null,
        /**
         * @type {GameController}
         */
        game: null,
        /**
         * @type {Backbone.Model}
         */
        model: null,
        /**
         * @type {boolean}
         */
        isRunning: false,
        /**
         *
         * @param {string} kind game type (human\ai)
         */
        init: function (kind) {
            if (this.view instanceof FieldView) {
                this.view.dispose();
                this.disposeGame();
            }
            this.game = new GameController(this.app);
            this.model = new Backbone.Model({score: 0});
            this.view = new FieldView(this.game.model, this.model);
            this.isRunning = true;

            if (kind === 'ai') {
                new AI(this.game.model);
            }
            gameBus.vent.trigger('start');
        },
        /**
         * gameBus:start handler
         */
        onGameStarted: function () {
            this.isRunning = true;
            this.renderLoop = setInterval(this.view.render.bind(this.view), UPDATE_FRAME);
        },
        /**
         * gameBus:end handler
         */
        onGameEnded: function () {
            new GameOverView(this.app, this.model);
            this.disposeGame();
        },
        /**
         * gameBus:collapse handler
         */
        onRowCollapsed: function () {
            var current = this.model.get('score');
            this.model.set({'score': current + 10});
        },
        /**
         * finishes a game (controller, rendering)
         */
        disposeGame: function () {
            this.isRunning = false;
            clearInterval(this.renderLoop);
            if (this.game) {
                this.game.dispose();
                this.game = null;
            }
        },

        dispose: function () {
            gameBus.vent.off('start', this.onGameStarted);
            gameBus.vent.off('end', this.onGameEnded);
            gameBus.vent.off('collapse', this.onRowCollapsed);
            this.model = null;
            this.game = null;
        }
    };

    UIController.prototype.constructor = UIController;

    return UIController;
});