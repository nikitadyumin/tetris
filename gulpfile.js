var gulp = require('gulp');
var serve = require('gulp-serve');
var concatCss = require('gulp-concat-css');
var clean = require('gulp-clean');
var autoprefixer = require('gulp-autoprefixer');
var rjs = require('gulp-requirejs');
var jasmine = require('gulp-jasmine');
var reporters = require('jasmine-reporters');

gulp.task('default', ['serve']);

gulp.task('build', ['scripts', 'css', 'copystatics']);

gulp.task('serve-dev', serve({
    port: 9000
}));

gulp.task('serve-prod', serve({
    root: 'out',
    port: 8080
}));

gulp.task('serve', ['build', 'serve-prod']);

gulp.task('css', function () {
    gulp.src('src/app/static_files/**', {read: false})
        .pipe(clean());
    return gulp.src('src/app/**/*.css')
        .pipe(concatCss("/static_files/styles/bundle.css"))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('src/app/'));
});

gulp.task('scripts', function () {
    return rjs({
        baseUrl: 'src/app',
        name: 'main',
        out: 'main.js',
        "paths": {
            "jquery": "empty:",
            "underscore": "empty:",
            "bootstrapjs": "empty:",
            "backbone": "empty:",
            "backbone.wreqr": "empty:",
            "backbone.statemanager": "empty:",
            "text": "../../bower_components/requirejs-text/text",
            "handlebars": "empty:"
        },
        "optimize": "uglify2"
    }).pipe(gulp.dest('out/app'));
});

gulp.task('copystatics', function () {
    gulp.src('bower_components/**')
        .pipe(gulp.dest('out/bower_components'));
    gulp.src('src/app/static_files/**')
        .pipe(gulp.dest('out/app/static_files'));
    return gulp.src('src/index.html')
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