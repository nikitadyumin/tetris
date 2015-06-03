/**
 * Created by nikita on 25.05.2015.
 * @exports ShapeL
 */
define(function(require) {
    var Shape = require('game/geom/shapes/Shape');

    var SIZE = 3;

    function ShapeL(color) {
        Shape.apply(this, [SIZE, color]);
    }

    ShapeL.prototype = new Shape();
    ShapeL.prototype.init = function() {
        for (var i = 0; i < SIZE; i += 1) {
            this.cells[0][i] = 1;
        }
        this.cells[1][0] = 1;
    };
    return ShapeL;
});