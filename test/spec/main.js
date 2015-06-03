/**
 * Created by ndyumin on 01.06.2015.
 */
var tests = [];
for (var file in window.__karma__.files) {
    if (window.__karma__.files.hasOwnProperty(file)) {
        if (/Spec\.js$/.test(file)) {
            tests.push(file);
        }
    }
}

requirejs.config({
    "baseUrl": 'base/src/app',
    "paths": {
        "brain": "../../bower_components/brain/lib/brain-0.6.3.min",
        "jquery": "../../bower_components/jquery/dist/jquery",
        "underscore": "../../bower_components/underscore/underscore",
        "bootstrapjs": "../../bower_components/bootstrap/dist/js/bootstrap",
        "backbone": "../../bower_components/backbone/backbone",
        "backbone.wreqr": "../../bower_components/backbone.wreqr/lib/backbone.wreqr",
        "backbone.statemanager": "../../bower_components/backbone.statemanager/backbone.statemanager",
        "text": "../../bower_components/requirejs-text/text",
        "handlebars": "../../bower_components/handlebars/handlebars"
    },
    "shim": {
        "handlebars": {
            "exports": "Handlebars"
        },
        "brain": {
            "exports": "brain"
        },
        "backbone": {
            "deps": ["jquery", "underscore"]
        },
        "backbone.wreqr": {
            "deps": ["backbone"]
        },
        "backbone.statemanager": {
            "deps": ["backbone"]
        },
        "bootstrapjs": {
            "deps": ["jquery"]
        }
    },

    deps: ['bootstrapjs', 'backbone'].concat(tests),

    callback: window.__karma__.start
});