/**
 * Created by nikita on 25.05.2015.
 */
define(function (require) {

    var Wreqr = require('backbone.wreqr');
    var globalBus = Wreqr.radio.channel('global');
    var gameBus = Wreqr.radio.channel('game');

    var Model = require('game/GameModel'),
        Block = require('game/geom/Block'),
        Settings = require('game/Settings'),
        Color = require('colors/Color'),
        Factory = require('game/geom/ShapeFactory');

    /**
     * @name GameController
     * @constructor
     */
    function GameController() {
        this.model = new Model(Settings.ROW_COUNT, Settings.COL_COUNT);
        this.createBlock();
        gameBus.vent.trigger('block:new');

        globalBus.vent.on('action', this.onAction, this);
        gameBus.vent.on('end', this.onGameEnded, this);
        gameBus.vent.on('start', this.onGameStarted, this);
    }

    GameController.prototype = /** @lends GameController.prototype*/{
        /**
         * @type {GameModel}
         */
        model: null,
        /**
         * @type {boolean}
         */
        paused: null,
        /**
         * tries to create a new active block and place it on top of the field
         * in case of failure, finishes the game
         * @returns {boolean}
         */
        createBlock: function () {
            var created = false,
                shape = Factory.create(),
                block = new Block(shape, Color.random());

            block.positionX = Math.floor(Settings.COL_COUNT / 2);
            block.positionY = 0;

            if (this.model.checkCollision(shape.getCells(), block.positionX, block.positionY)) {
                gameBus.vent.trigger('end');
            } else {
                this.model.setActiveBlock(block);

                created = true;
            }

            return created;
        },

        onGameStarted: function () {
            this.loop = setInterval(this.onUpdate.bind(this), Settings.INTERVAL);
            this.paused = false;
        },

        onGameEnded: function () {
            clearInterval(this.loop);
            this.paused = null;
            this.dispose();
        },

        onGamePaused: function () {
            clearInterval(this.loop);
            this.paused = true;
        },

        /**
         * handles a 'tick' in the game
         * mainly describes 'gravity'
         */
        onUpdate: function () {
            var block = this.model.getActiveBlock(),
                newY = block.positionY + 1;

            if (this.model.checkCollision(block.shape.getCells(), block.positionX, newY)) {
                var isCreated = this.createBlock();
                if (isCreated) {
                    this.model.addBlock(block);
                    gameBus.vent.trigger('block:new');
                }
            } else {
                block.positionY = newY;
            }
        },

        /**
         * in case a part of the Shape's cells is to the left of the field,
         *  moves the Block to the right and tries to fit it
         * @param {Block} block
         * @param {number} cells
         * @returns {boolean}
         * @private
         */
        _handleLeftEdge: function (block, cells) {
            var newX = block.positionX;
            while (newX <= 0) {
                newX += 1;
                if (!this.model.checkCollision(cells, newX, block.positionY)) {
                    block.shape.setCells(cells);
                    block.positionX = newX;
                    return true;
                }
            }
            return false;
        },

        /**
         * the same as <code>_handleLeftEdge</code>, but handles the right edge (shifts to the left)
         * @param {Block} block
         * @param cells
         * @returns {boolean}
         * @private
         */
        _handleRightEdge: function (block, cells) {
            var newX = block.positionX;
            while (newX + block.size >= Settings.COL_COUNT) {
                newX -= 1;
                if (!this.model.checkCollision(cells, newX, block.positionY)) {
                    block.shape.setCells(cells);
                    block.positionX = newX;
                    return true;
                }
            }
            return false;
        },

        /**
         * drops a block all the way down until it gets added to the field
         */
        drop: function () {
            var move = true;
            gameBus.vent.once('block:added', function () {
                move = false;
            });
            while (move) {
                this.onUpdate();
            }
        },
        /**
         * handles user actions
         * @param {string} type
         */
        onAction: function (type) {
            if (this.paused && type !== 'pause') {
                return;
            }
            var block = this.model.getActiveBlock();
            switch (type) {
                case 'rotate':
                    var rotated = block.shape.getRotatedCW();
                    if (!this.model.checkCollision(rotated, block.positionX, block.positionY)) {
                        block.shape.setCells(rotated);
                    } else {
                        this._handleLeftEdge(block, rotated) || this._handleRightEdge(block, rotated);
                    }
                    break;
                case 'left':
                    if (!this.model.checkCollision(block.shape.getCells(), block.positionX - 1, block.positionY)) {
                        block.positionX -= 1;
                    }
                    break;
                case 'right':
                    if (!this.model.checkCollision(block.shape.getCells(), block.positionX + 1, block.positionY)) {
                        block.positionX += 1;
                    }
                    break;
                case 'drop':
                    this.drop();
                    break;
                case 'pause':
                    if (!this.paused) {
                        this.onGamePaused();
                    } else {
                        this.onGameStarted();
                    }
                    break;
            }
        },

        dispose: function () {
            clearInterval(this.loop);
            globalBus.vent.off('action', this.onAction);
            gameBus.vent.off('end', this.onGameEnded);
            gameBus.vent.off('start', this.onGameStarted);

            this.model = null;
        }
    };

    return GameController;
});