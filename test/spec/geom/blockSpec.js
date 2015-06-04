/**
 * Created by ndyumin on 04.06.2015.
 */
define(function (require) {
    var Shape = require('game/geom/shapes/Shape');
    var Block = require('game/geom/Block');

    describe("Block", function () {
        it("should create a shortcut to the containing shape size", function () {
            var shape = new Shape(6);
            var block = new Block(shape, null);
            expect(block.size).toBe(6);
        });
    });
});