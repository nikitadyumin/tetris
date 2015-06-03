/**
 * Created by ndyumin on 30.05.2015.
 * @exports AIController
 */
define(function (require) {
    var Wreqr = require('backbone.wreqr');
    var gameBus = Wreqr.radio.channel('game');
    var globalBus = Wreqr.radio.channel('global');

    var Shape = require('game/geom/shapes/Shape'),
        Block = require('game/geom/Block'),
        Field = require('game/GameModel'),
        Color = require('colors/Color');

    function isDefined(cell) {
        return !!cell;
    }

    /**
     * @name AIController
     * @param model
     * @constructor
     */
    function AIController(model) {
        this.model = model;
        gameBus.vent.on('block:new', this.place, this);
        gameBus.vent.on('end', this.dispose, this);
    }

    AIController.prototype = /** @lends AIController.prototype */{
        /**
         *
         * @param {Color[][]} cells figure cells (shape cells)
         * @param {number} x column index
         * @returns {*}
         */
        checkPath: function (cells, x) {
            var y = null;
            while (!this.model.checkCollision(cells, x, y)) {
                y += 1;
            }
            if (y) {
                return {
                    cells: cells,
                    x: x,
                    y: y - 1
                };
            }
            return null;
        },
        /**
         * imitates a user action
         * @param {string} action
         */
        triggerAction: function (action) {
            setTimeout(function () {
                globalBus.vent.trigger('action', action);
            }, 10);
        },
        /**
         * sets up a block on the field with the given x coord and rotation
         * @param {block} block
         * @param {number} coordX
         * @param {number} rotations
         */
        navigate: function (block, coordX, rotations) {
            var delta = Math.abs(coordX - block.positionX);
            var action = coordX - block.positionX > 0 ? 'right' : 'left';
            for (var j = 0; j < rotations; j += 1) {
                this.triggerAction('rotate');
            }
            for (var i = 0; i < delta; i += 1) {
                this.triggerAction(action);
            }
        },
        /**
         *
         * @param {Color[][]} cells (shapes's cells)
         * @param {number} rotations number of rotation to get to the shape from the original one
         * @returns {Array}
         */
        findOptionsForRotation: function (cells, rotations) {
            var options = [];
            for (var col = -3; col < 10; col += 1) {
                var path = this.checkPath(cells, col);
                if (path) {
                    path.rotations = rotations || 0;
                    options.push(path);
                }
            }
            return options;
        },
        /**
         * finds available options,
         * calculates scores for them,
         * picks up the one with the highest score,
         * triggers navigation actions
         */
        place: function () {
            var model = this.model;
            var block = model.getActiveBlock();
            var cells = block.shape.getCells();

            var shape90 = new Shape();
            shape90.setCells(block.shape.getRotatedCW());
            var shape180 = new Shape();
            shape180.setCells(shape90.getRotatedCW());
            var shape270 = new Shape();
            shape270.setCells(shape180.getRotatedCW());

            var options = [].concat(
                this.findOptionsForRotation(cells, 0),
                this.findOptionsForRotation(shape90.getCells(), 1),
                this.findOptionsForRotation(shape180.getCells(), 2),
                this.findOptionsForRotation(shape270.getCells(), 3)
            );

            function max(arr, f) {
                return arr.reduce(function (item1, item2) {
                    return f(item1) > f(item2) ? item1 : item2;
                });
            }

            function sum(a, b) {
                return a + b;
            }

            function calculateScore(matrix) {
                var score = 0;
                var detected;
                var heights = [];
                var holes = 0;
                for (var col = 0; col < 10; col += 1) {
                    detected = false;
                    heights[col] = 0;
                    for (var row = 0; row < 20; row += 1) {
                        if (matrix[row][col]) {
                            if (!detected) {
                                heights[col] = 20 - row;
                                detected = true;

                            }
                        } else {
                            if (detected) {
                                holes += 1;
                            }
                        }
                    }
                }

                var heightSum = heights.reduce(sum);

                var collapsed = matrix.reduce(function (num, line) {
                    if (10 === line.filter(isDefined)) {
                        num += 1;
                    }
                    return num;
                }, 0);

                var bumpiness = 0;
                for (var i = 1; i < 10; i += 1) {
                    bumpiness += Math.abs(heights[i - 1] - heights[i]);
                }

                score += heightSum * -0.510066;
                score += collapsed * 0.960666;
                score += holes * -0.35663;
                score += bumpiness * -0.184483;
                return score;
            }

            var scored = options.map(function (opt) {
                var map = new Field();
                map.fieldMap = model.getCells();


                var block = new Block(new Shape().setCells(opt.cells), 1);
                block.positionX = opt.x;
                block.positionY = opt.y;
                map.addBlock(block);
                var score = calculateScore(map.fieldMap);
                return {
                    x: opt.x,
                    y: opt.y,
                    cells: opt.cells,
                    rotations: opt.rotations,
                    score: score + (opt.y*0.3)
                };
            });
            var option = max(scored, function (el) {
                return el.score;
            });
            this.navigate(block, option.x, option.rotations);
        },
        /**
         *
         */
        dispose: function () {
            gameBus.vent.off('block:new', this.place);
            gameBus.vent.off('end', this.dispose);
            this.model = null;
        }
    };

    AIController.prototype.constructor = AIController;

    return AIController;
});