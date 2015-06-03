/**
 * Created by nikita on 25.05.2015.
 *
 */
define(function(require) {
    var ShapeI = require('game/geom/shapes/ShapeI'),
        ShapeJ = require('game/geom/shapes/ShapeJ'),
        ShapeL = require('game/geom/shapes/ShapeL'),
        ShapeO = require('game/geom/shapes/ShapeO'),
        ShapeT = require('game/geom/shapes/ShapeT'),
        ShapeZ = require('game/geom/shapes/ShapeZ');

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