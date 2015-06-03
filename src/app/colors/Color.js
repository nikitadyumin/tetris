/**
 * Created by ndyumin on 26.05.2015.
 * @exports Color
 */
define(function () {
    var MAX_BRIGHTNESS = 200;

    /**
     * @name Color
     * @constructor
     */
    function Color(rgb) {
        this.rgb = rgb;
    }

    Color.prototype = /** @lends Color.prototype*/{
        toRgbString: function () {
            return 'rgb(' + this.rgb.join(',') + ')';
        },
        /**
         * returns a new instance of <code>Color</code> with shifted RGB values
         * @param {number} shift
         * @returns {Color}
         */
        getShifted: function (shift) {
            return new Color(this.rgb.map(function (item) {
                return item + shift;
            }));
        }
    };

    /**
     * @static
     * @returns {Color}
     */
    Color.random = function () {
        return new Color([0, 0, 0].map(function () {
            return Math.floor(Math.random() * MAX_BRIGHTNESS);
        }));
    };

    return Color;
});