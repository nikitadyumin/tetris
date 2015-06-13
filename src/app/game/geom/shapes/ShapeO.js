/**
 * Created by nikita on 25.05.2015.
 * @exports ShapeO
 */
define(function(require) {
    var Shape = require('./Shape');


    var SIZE = 2;

    function ShapeO(color) {
        Shape.apply(this, [SIZE, color]);
    }

    ShapeO.prototype = new Shape();
    ShapeO.prototype.init = function() {
        for (var i = 0; i < SIZE; i += 1) {
            for (var j = 0; j < SIZE; j += 1) {
                this.cells[i][j] = 1;
            }
        }
    };
    return ShapeO;
});