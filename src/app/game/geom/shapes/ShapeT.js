/**
 * Created by nikita on 25.05.2015.
 * @exports ShapeT
 */
define(function(require) {
    var Shape = require('game/geom/shapes/Shape');
    var SIZE = 3;

    /**
     * @name ShapeT
     * @constructor
     * @augments Shape
     */
    function ShapeT(color) {
        Shape.apply(this, [SIZE, color]);
    }

    ShapeT.prototype = new Shape();
    ShapeT.prototype.init = function() {
        for (var i = 0; i < SIZE; i += 1) {
            this.cells[1][i] = 1;
        }
        this.cells[0][1] = 1;
    };

    return ShapeT;
});