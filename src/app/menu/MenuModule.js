/**
 * Created by ndyumin on 29.05.2015.
 */
define(function(require) {
    var MenuView = require('menu/MenuView');
    return function(app) {
        this.menu = new MenuView(app);
    }
});