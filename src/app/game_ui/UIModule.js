/**
 * Created by ndyumin on 29.05.2015.
 * @exports UIModule
 */
define(function(require) {
    var Wreqr = require('backbone.wreqr');
    var globalBus = Wreqr.radio.channel('global');

    var UIController = require('game_ui/UIController');

    return function(app) {
        var controller = new UIController(app);
        globalBus.vent.on('newgame', controller.init, controller);
    }
});