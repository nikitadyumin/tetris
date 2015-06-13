/**
 * Created by ndyumin on 29.05.2015.
 * @exports UIModule
 */
define(function(require) {
    require('./styles/field.less');

    var Wreqr = require('backbone.wreqr');
    var globalBus = Wreqr.radio.channel('global');

    var UIController = require('./UIController');

    return function(app) {
        var controller = new UIController(app);
        globalBus.vent.on('newgame', controller.init, controller);
    }
});