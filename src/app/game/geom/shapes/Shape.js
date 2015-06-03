/**
 * Created by nikita on 25.05.2015.
 * @exports Shape
 */
define(function() {
    /**
     * a base proto for geometric entities of the game
     * @name Shape
     * @param size
     * @constructor
     */
    function Shape(size) {
        this.cells = [];
        for (var i = 0; i < size; i += 1){
            this.cells[i] = [];
        }
        this.init();
    }

    Shape.prototype = /** @lends Shape.prototype */{
        /**
         * @type {Color[][]}
         */
        cells: null,
        /**
         * adds cells to the shape
         */
        init: function() {},
        /**
         * returns a copy of figure cells
         * @returns {Color[][]}
         */
        getCells: function() {
            return this.cells.map(function(row) {
                return row.slice();
            });
        },
        /**
         *
         * @param {Color[][]} field
         * @returns {Shape}
         */
        setCells: function(field) {
            this.cells = field;
            return this;
        },
        /**
         *
         * @returns {Color[][]} transposed copy of matrix
         * @private
         */
        _getTransposed: function() {
            var copy = this.getCells();
            for (var row = 0, l = this.cells.length; row < l; row += 1) {
                for (var col = 0; col < l; col += 1) {
                    copy[row][col] = this.cells[col][row];
                }
            }
            return copy;
        },
        /**
         *
         * @returns {Color[][]} a clockwise rotated copy of matrix
         */
        getRotatedCW: function() {
            var transposed = this._getTransposed();
            return transposed.map(function (row) {
                return row.reverse();
            });
        }
    };

    return Shape;
});