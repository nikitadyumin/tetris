/**
 * Created by nikita on 25.05.2015.
 * @exports ShapeZ
 */
define(function(require) {
    var Shape = require('./Shape');

    var SIZE = 3;

    /**
     * @name ShapeZ
     * @constructor
     * @augments Shape
     */
    function ShapeZ(color) {
        Shape.apply(this, [SIZE, color]);
    }

    ShapeZ.prototype = new Shape();
    ShapeZ.prototype.init = function() {
        for (var i = 0; i < 2; i += 1) {
            this.cells[0][i] = 1;
        }
        for (var i = 1; i < SIZE; i += 1) {
            this.cells[1][i] = 1;
        }
    };
    return ShapeZ;
});