/**
 * Created by ndyumin on 05.06.2015.
 */
define(function (require) {

    var Wreqr = require('backbone.wreqr');

    var gameBus = Wreqr.radio.channel('game');

    var Model = require('game/GameModel');
    var Block = require('game/geom/Block');
    var Shape = require('game/geom/shapes/Shape');

    describe("Model", function () {
        it("should create a field of a given size", function () {
            var model = new Model(21,11);
            expect(model.fieldMap.length).toBe(21);
            model.dispose();
        });
        it("should return a copy of a field", function () {
            var model = new Model(21,11);
            model.fieldMap[5][5] = 1;
            model.fieldMap[3][2] = 1;
            var copy = model.getCells();
            model.fieldMap[5][5] = 2;
            model.fieldMap[3][2] = 2;
            expect(copy[5][5]).toBe(1);
            expect(copy[3][2]).toBe(1);
        });
        it("should set an active block of {Block}", function () {
            var model = new Model(21,11);
            var block = new Block(new Shape(2), null);
            model.setActiveBlock(block);
            expect(model.getActiveBlock()).toBe(block);
            var failure = jasmine.createSpy('failure');
            try {
                model.setActiveBlock(123);
            } catch(e) {
                failure();
            }
            expect(failure).toHaveBeenCalled();
            expect(model.getActiveBlock()).toBe(block);
        });
        it("should remove full rows filling the field with empty ones", function () {
            var model = new Model(5,5);
            model.fieldMap[0] = [1,1,1,1,1];
            model.fieldMap[4] = [1,1,1,1,1];
            model.removeFullRows();
            expect(model.fieldMap.length).toBe(5);
            expect(model.fieldMap[0]).toEqual([]);
            expect(model.fieldMap[4]).toEqual([]);
        });
        it("should trigger 'collapse' on gameBus", function (clb) {
            var model = new Model(5,5);
            model.fieldMap[0] = [1,1,1,1,1];
            model.fieldMap[4] = [1,1,1,1,1];
            var count = 0;
            function handler() {
                count += 1;
                if (count === 2) {
                    gameBus.vent.off('collapse', handler);
                    clb();
                }
            }
            gameBus.vent.on('collapse', handler);
            model.removeFullRows();
        });
        it("should call removeFullRows method on adding a block", function () {
            var model = new Model(21,11);
            var block = new Block(new Shape(2), null);
            spyOn(model, 'removeFullRows');
            model.addBlock(block);
            expect(model.removeFullRows).toHaveBeenCalled();
        });
        it("should be able to check if an external set of cells collides with a field at a given coordinates", function () {
            /**
             * @type {GameModel}
             */
            var model = new Model(5, 5);
            model.fieldMap[2][2] = 1;
            var block = new Block(new Shape(2), 5);
            block.shape.setCells([[2, 2],[2, 2]]);
            expect(model.checkCollision(block.shape.getCells(), 1, 1)).toBeTruthy();
            expect(model.checkCollision(block.shape.getCells(), 2, 2)).toBeTruthy();
            expect(model.checkCollision(block.shape.getCells(), 0, 0)).toBeFalsy();
            expect(model.checkCollision(block.shape.getCells(), 3, 3)).toBeFalsy();
        });
        it("should be able to add a block to a field permanently using a block color and throw exception if it is not successful", function () {
            /**
             * @type {GameModel}
             */
            var model = new Model(5, 5);
            model.fieldMap[2][2] = 1;
            var COLOR = 5;
            var block = new Block(new Shape(2), COLOR);
            block.shape.setCells([[2, 2],[2, 2]]);
            block.positionX = 0;
            block.positionY = 0;
            model.addBlock(block);
            expect(model.fieldMap[0][0]).toBe(COLOR);
            expect(model.fieldMap[1][1]).toBe(COLOR);
            expect(model.fieldMap[2][2]).toBe(1);
            var failure = jasmine.createSpy('failure');
            try {
                model.addBlock(block);
            } catch(e) {
                failure();
            }
            expect(failure).toHaveBeenCalled();
        });
    });

});