/**
 * Created by ndyumin on 26.05.2015.
 * @exports Block
 */
define(function() {
    /**
     *
     * A game element (figure), can be positioned on the play field
     * @name {Block}
     * @param {Shape} shape
     * @param {Color} color
     * @constructor
     */
    function Block(shape, color) {
        this.shape = shape;
        this.color = color;
        this.size = this.shape.getCells().length;
    }

    Block.prototype = /** @lends Block.prototype */{
        /**
         * @type {Shape}
         */
        shape: null,
        /**
         * @type {Color}
         */
        color: null,
        /**
         * a shorthand for a geometrical length
         * @type {number}
         */
        size: null,
        /**
         * @type {number}
         */
        positionX: null,
        /**
         * @type {number}
         */
        positionY: null
    };

    return Block;
});