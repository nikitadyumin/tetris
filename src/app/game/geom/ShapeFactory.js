/**
 * Created by nikita on 25.05.2015.
 *
 */
define(function(require) {
    var ShapeI = require('./shapes/ShapeI'),
        ShapeJ = require('./shapes/ShapeJ'),
        ShapeL = require('./shapes/ShapeL'),
        ShapeO = require('./shapes/ShapeO'),
        ShapeT = require('./shapes/ShapeT'),
        ShapeZ = require('./shapes/ShapeZ');

    var constructors = [ShapeI, ShapeJ, ShapeL, ShapeO, ShapeT, ShapeZ];

    function getRandomItem(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function create() {
        var C = getRandomItem(constructors);
        return new C();
    }

    return {
        create: create
    };
});