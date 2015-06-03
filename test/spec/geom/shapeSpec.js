/**
 * Created by ndyumin on 03.06.2015.
 */
define(function (require) {
    var Shape = require('game/geom/shapes/Shape');

    describe("Shape", function () {
        it("should create a matrix with a given size", function () {
            var shape = new Shape(5);
            expect(shape.cells.length).toBe(5);
        });
        it("should initialize shape cells with an ini method", function () {
            function ExtendedShape(size, color) {
                Shape.apply(this, [size, color]);
            }

            ExtendedShape.prototype = new Shape();
            ExtendedShape.prototype.init = function () {
                this.cells[0][0] = 1;
                this.cells[3][3] = 1;
            };
            var shape = new ExtendedShape(4, 8);
            expect(shape.cells[0][0]).toBe(1);
            expect(shape.cells[3][3]).toBe(1);
            expect(shape.cells[0][1]).not.toBeDefined();
            expect(shape.cells[1][0]).not.toBeDefined();
        });
        it('should return a *copy* of cells', function () {
            var shape = new Shape(5);
            shape.cells[1][2] = 1;
            shape.cells[1][3] = 2;
            var copy = shape.getCells();
            expect(copy[1][2]).toBe(1);
            expect(copy[1][3]).toBe(2);
            copy[1][2] = 3;
            copy[1][2] = 3;
            expect(shape.cells[1][2]).toBe(1);
            expect(shape.cells[1][3]).toBe(2);
        });
        it('should return a rotated copy of cells', function () {
            var shape = new Shape(5);
            shape.cells[1][2] = 1;
            shape.cells[1][3] = 2;
            var rotated = shape.getRotatedCW();
            expect(shape.cells[1][2]).toBe(1);
            expect(shape.cells[1][3]).toBe(2);
            expect(rotated[1][2]).not.toBeDefined();
            expect(rotated[1][3]).not.toBeDefined();
            expect(rotated[2][3]).toBe(1);
            expect(rotated[3][3]).toBe(2);
        });
        it('should set cells via setter and return itself', function () {
            var shape = new Shape(2);
            var cells = [[0, 1], [1, 0]];
            expect(shape.cells[0][1]).not.toBeDefined();
            expect(shape.cells[1][0]).not.toBeDefined();
            var result = shape.setCells(cells);
            expect(result instanceof Shape).toBeTruthy();
            expect(shape.cells[0][1]).toBeDefined();
            expect(shape.cells[1][0]).toBeDefined();
        });
    });
});
