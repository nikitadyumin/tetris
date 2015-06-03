var gulp = require('gulp');
var serve = require('gulp-serve');
var concatCss = require('gulp-concat-css');
var autoprefixer = require('gulp-autoprefixer');
var requirejsOptimize = require('gulp-requirejs-optimize');
var jasmine = require('gulp-jasmine');
var reporters = require('jasmine-reporters');

gulp.task('default', ['css', 'serve-dev']);

gulp.task('build', ['scripts', 'css', 'copystatics']);

gulp.task('serve-dev', serve({
    port: 9000
}));


gulp.task('css', function () {
    return gulp.src('src/app/**/*.css')
        .pipe(concatCss("/static_files/styles/bundle.css"))
        //.pipe(autoprefixer({
        //    browsers: ['last 2 versions'],
        //    cascade: false
        //}))
        .pipe(gulp.dest('src/app/'));
});

gulp.task('scripts', function () {
    return gulp.src('src/app/bootstrap.js')
        .pipe(requirejsOptimize({
            "paths": {
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
                "bootstrapjs": {
                    "deps": ["jquery"]
                }
            },
            "deps": ["bootstrapjs"]
        }))
        .pipe(gulp.dest('out/js'));
});

gulp.task('copystatics', function() {
    gulp.src('src/app/static_files/**')
        .pipe(gulp.dest('out/static_files'));
    gulp.src('src/index.html')
        .pipe(gulp.dest('out'));
});

gulp.task('test', function () {
    return gulp.src('test/test.js')
        .pipe(jasmine({
            reporter: new reporters.JUnitXmlReporter()
        }));
});


var karma = require('karma').server;

/**
 * Run test once and exit
 */
gulp.task('test', function (done) {
    karma.start({
        configFile: __dirname + '/test/karma.conf.js',
        singleRun: true
    }, done);
});

/**
 * Watch for file changes and re-run tests on each change
 */
gulp.task('tdd', function (done) {
    karma.start({
        configFile: __dirname + '/test/karma.conf.js'
    }, done);
});

gulp.task('default', ['tdd']);