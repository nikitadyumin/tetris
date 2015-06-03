/**
 * Created by nikita on 25.05.2015.
 * @exports ShapeI
 */
define(function(require) {
    var Shape = require('game/geom/shapes/Shape');

    var SIZE = 4;

    /**
     * @name ShapeI
     * @constructor
     * @augments Shape
     */
    function ShapeI(color) {
        Shape.apply(this, [SIZE, color]);
    }

    ShapeI.prototype = new Shape();
    /**
     * @inheritDoc
     */
    ShapeI.prototype.init = function() {
        for (var i = 0; i < 4; i += 1) {
            this.cells[1][i] = 1;
        }
    };
    return ShapeI;
});