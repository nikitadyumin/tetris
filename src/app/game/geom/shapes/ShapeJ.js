/**
 * Created by nikita on 25.05.2015.
 * @exports ShapeJ
 */
define(function(require) {
    var Shape = require('./Shape');

    var SIZE = 3;
    /**
     * @name ShapeJ
     * @constructor
     * @augments Shape
     */
    function ShapeJ(color) {
        Shape.apply(this, [SIZE, color]);
    }

    ShapeJ.prototype = new Shape();
    ShapeJ.prototype.init = function() {
        for (var i = 0; i < 3; i += 1) {
            this.cells[0][i] = 1;
        }
        this.cells[1][2] = 1;
    };

    return ShapeJ;
});