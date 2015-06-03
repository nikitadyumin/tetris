/**
 * Created by nikita on 25.05.2015.
 *
 * @exports GameModel
 */
define(function (require) {
    var Backbone = require('backbone'),
        Wreqr = require('backbone.wreqr');

    var gameBus = Wreqr.radio.channel('game');

    var Shape = require('game/geom/shapes/Shape'),
        Block = require('game/geom/Block');

    /**
     * @name GameModel
     * @constructor
     * @augments Backbone.Model
     */
    var GameModel = Backbone.Model.extend(/** @lends GameModel.prototype*/{
        /**
         * @type {string[][]}
         */
        fieldMap: null,
        /**
         * @type {Block}
         */
        active: null,

        initialize: function (rowCount, colCount) {
            this.colCount = colCount;
            this.rowCount = rowCount;
            this.fieldMap = [];
            for (var i = 0; i < this.rowCount; i += 1) {
                this.fieldMap[i] = [];
            }
        },

        getCells: function () {
            return this.fieldMap.map(function (row) {
                return row.slice();
            });
        },

        /**
         *
         * @param {Block} el
         */
        setActiveBlock: function (el) {
            if (el instanceof Block) {
                this.active = el;
            } else {
                throw new Error('cannot set an active element');
            }
        },

        /**
         *
         * @returns {Block}
         */
        getActiveBlock: function () {
            return this.active;
        },

        /**
         * processes complete lines
         * @event collapse fired on each line collapse
         */
        removeFullRows: function () {
            var cols = this.colCount;
            this.fieldMap = this.fieldMap.filter(function (row) {
                return row.filter(function (cell) {
                        return !!cell;
                    }).length !== cols
            });
            while (this.fieldMap.length < this.rowCount) {
                this.fieldMap.unshift([]);
                gameBus.vent.trigger('collapse');
            }
        },

        /**
         * permanently adds a block to the field
         * @param {Block} block
         */
        addBlock: function (block) {
            var figureCells = block.shape.getCells();

            for (var rowIndex = 0, li = block.size; rowIndex < li; rowIndex += 1) {
                for (var columnIndex = 0, lj = block.size; columnIndex < lj; columnIndex += 1) {
                    var figureCell = figureCells[rowIndex][columnIndex];

                    if (!!figureCell) {
                        var shiftedY = (block.positionY + rowIndex),
                            shiftedX = (block.positionX + columnIndex);

                        if (!this.fieldMap[shiftedY][shiftedX]) {
                            this.fieldMap[shiftedY][shiftedX] = block.color;
                        } else {
                            throw new Error('cannot add, a target cell is not empty');
                        }
                    }
                }
            }
            gameBus.vent.trigger('block:added');
            this.removeFullRows();
        },

        /**
         * Checks if an element collides with elements of the field at the current position
         * @param {string[][]} element
         * @param {number} x
         * @param {number} y
         * @returns {boolean}
         */
        checkCollision: function (element, x, y) {
            for (var rowIndex = 0, li = element.length; rowIndex < li; rowIndex += 1) {
                for (var columnIndex = 0, lj = element.length; columnIndex < lj; columnIndex += 1) {
                    var cell = element[rowIndex][columnIndex];

                    if (!!cell) {
                        var row = this.fieldMap[y + rowIndex];
                        if (!row
                            || x + columnIndex < 0
                            || x + columnIndex >= this.colCount
                            || !!row[x + columnIndex]) {
                            return true;
                        }
                    }
                }
            }
            return false;
        },

        dispose: function () {
            this.off();
            this.fieldMap = null;
        }
    });

    return GameModel;
});