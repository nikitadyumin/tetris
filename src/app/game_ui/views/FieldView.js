/**
 * Created by nikita on 24.05.2015.
 *
 * @exports FieldView
 */

define(function (require) {
    var Backbone = require('backbone'),
        $ = require('jquery');

    var Settings = require('../../game/Settings'),
        UISettings = require('../UISettings'),
        GameOverView = require('./GameOverView');

    var FieldView = Backbone.View.extend(/** @lends FieldView.prototype */{
        el: 'canvas#field',
        /**
         * @type {number}
         */
        cellSize: 10,
        /**
         * @type {number}
         */
        left: 0,
        /**
         * @type {boolean}
         */
        isRunning: false,
        /**
         *
         * @param gameModel
         * @param scoreModel
         */
        initialize: function (gameModel, scoreModel) {
            this.gameModel = gameModel;
            this.scoreModel = scoreModel;
            this.ctx = this.$el.get(0).getContext("2d");
            this.rescaleField();
            $(window).on('resize', this.rescaleField.bind(this));
        },
        /**
         * update canvas' width and height, recalculate cell size and a left padding
         */
        rescaleField: function () {
            this.availHeight = this.$el.height();
            this.availWidth = this.$el.width();
            this.$el.attr('width', this.availWidth);
            this.$el.attr('height', this.availHeight);

            this.cellSize = Math.floor((this.availHeight - UISettings.MARGIN * 2) / Settings.ROW_COUNT);
            this.left = Math.floor((this.availWidth - this.cellSize * Settings.COL_COUNT - UISettings.BORDER_WIDTH * 2) / 2);
        },
        /**
         *
         * @private
         */
        _clearCanvas: function () {
            this.ctx.fillStyle = UISettings.BACKGROUND_COLOR;
            this.ctx.fillRect(0, 0, this.availWidth, this.availHeight);
        },
        /**
         *
         * @private
         */
        _drawField: function () {
            this.ctx.fillStyle = UISettings.FIELD_COLOR;
            this.ctx.fillRect(this.left, UISettings.MARGIN, this.cellSize * Settings.COL_COUNT, this.cellSize * Settings.ROW_COUNT);
        },
        /**
         *
         * @private
         */
        _drawScore: function () {
            this.ctx.fillStyle = '#f0f0f0';
            this.ctx.font = '30px Roboto';
            this.ctx.fillText(this.scoreModel.get('score'), 10, 50);
        },
        /**
         *
         * @param {number} x
         * @param {number} y
         * @param {Color} color
         * @private
         */
        _drawCell: function (x, y, color) {
            this.ctx.fillStyle = color.toRgbString();
            this.ctx.fillRect(x, y, this.cellSize, this.cellSize);

            this.ctx.fillStyle = color.getShifted(20).toRgbString();
            this.ctx.beginPath();
            this.ctx.moveTo(x, y);
            this.ctx.lineTo(x, y + this.cellSize);
            this.ctx.lineTo(x + this.cellSize, y);
            this.ctx.closePath();
            this.ctx.fill();

            this.ctx.fillStyle = color.getShifted(10).toRgbString();
            this.ctx.beginPath();
            this.ctx.moveTo(x, y);
            this.ctx.lineTo(x, y + this.cellSize);
            this.ctx.lineTo(x + this.cellSize / 2, y + this.cellSize / 2);
            this.ctx.closePath();
            this.ctx.fill();

            this.ctx.fillStyle = color.getShifted(-10).toRgbString();
            this.ctx.beginPath();
            this.ctx.moveTo(x + this.cellSize, y + this.cellSize);
            this.ctx.lineTo(x, y + this.cellSize);
            this.ctx.lineTo(x + this.cellSize / 2, y + this.cellSize / 2);
            this.ctx.closePath();
            this.ctx.fill();
        },
        /**
         *
         * @param {Color[][]} model
         * @private
         */
        _renderField: function (model) {
            var len = model.length;

            for (var row = 0; row < len; row += 1) {
                for (var col = 0; col < 10; col += 1) {
                    if (model[row][col]) {
                        this._drawCell(this.left + col * this.cellSize, UISettings.MARGIN + row * this.cellSize, model[row][col]);
                    }
                }
            }
        },
        /**
         *
         * @param {Block} block
         * @private
         */
        _renderActiveBlock: function (block) {
            var cells = block.shape.getCells();

            for (var row = 0; row < block.size; row += 1) {
                for (var col = 0; col < block.size; col += 1) {
                    if (cells[row][col]) {
                        this._drawCell(
                            this.left + (block.positionX + col) * this.cellSize,
                            UISettings.MARGIN + (block.positionY + row) * this.cellSize,
                            block.color
                        );
                    }
                }
            }
        },
        /**
         *
         */
        render: function () {
            this._clearCanvas();
            this._drawField();
            this._drawScore();
            this._renderField(this.gameModel.fieldMap);
            this._renderActiveBlock(this.gameModel.getActiveBlock());
        },
        /**
         *
         */
        dispose: function () {
            $(window).off('resize');
            this.gameModel = null;
            this.scoreModel = null;
        }
    });

    return FieldView;
});
