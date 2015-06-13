/**
 * Created by ndyumin on 29.05.2015.
 */
define(function(require) {
    require('!style!css!less!./styles/menu.less');
    var MenuView = require('./MenuView');
    return function(app) {
        this.menu = new MenuView(app);
    }
});