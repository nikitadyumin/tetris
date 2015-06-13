/**
 * Created by nikita on 24.05.2015.
 * @exports TetrisApplication
 */
define(function(require) {
    require('./main.less');
    require('jquery');
    //require('bootstrap');

    var Backbone = require('backbone');
    var _ = require('underscore');

    var UIModule = require('./game_ui/UIModule');
    var MenuModule = require('./menu/MenuModule');

    /**
     * @name TetrisApplication
     * @constructor
     */
    function TetrisApplication() {

    }

    TetrisApplication.prototype = /** @lends TetrisApplication.prototype */{
        _loadPlugins: function() {
        },

        _loadModules: function() {
            UIModule(this);
            MenuModule(this);
        },

        start: function() {
            this._loadPlugins();
            this._loadModules();

            Backbone.history.start();
            this.trigger('start');
            return this;
        }
    };

    _.extend(TetrisApplication.prototype, Backbone.Events);

    return TetrisApplication;
});