/**
 * Created by Никита on 25.05.2015.
 *
 * @exports KeyboardController
 */
define(function(require) {
    var Wreqr = require('backbone.wreqr');

    var globalBus = Wreqr.radio.channel('global');

    var mapping = {
        32: 'rotate',
        37: 'left',
        39: 'right',
        40: 'drop',
        80: 'pause'
    };

    function onKeypress(e) {
        globalBus.vent.trigger('action', mapping[e.keyCode]);
    }

    function KeyboardController() {
        document.body.addEventListener('keydown', onKeypress);
    }

    KeyboardController.prototype = {
        dispose: function() {
            document.body.removeEventListener('keydown', onKeypress);
        }
    };

    return KeyboardController;
});