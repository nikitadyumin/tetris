var Promise = require('promise');

var gulp = require('gulp');
//var gutil = require('gulp-util');
var webpack = require("webpack");
var wpstream = require("webpack-stream");
var serve = require('gulp-serve');
//var less = require('gulp-less');
var path = require('path');
var concatCss = require('gulp-concat-css');
var clean = require('gulp-clean');
var autoprefixer = require('gulp-autoprefixer');
var jasmine = require('gulp-jasmine');
var reporters = require('jasmine-reporters');

gulp.task('default', ['serve']);

var plugins = require("gulp-load-plugins")({
    pattern: ['gulp-*', 'gulp.*', 'main-bower-files'],
    replaceString: /\bgulp[\-.]/
});

var dest = 'dist/';

gulp.task('js', function () {
    return gulp.src(plugins.mainBowerFiles())
            .pipe(plugins.filter('*.js'))
            .pipe(plugins.concat('lib.js'))
            .pipe(plugins.uglify())
            .pipe(gulp.dest(dest));
});

gulp.task('css', function () {
    return gulp.src(plugins.mainBowerFiles())
        .pipe(plugins.filter('*.css'))
        .pipe(plugins.concat('main.css'))
        .pipe(gulp.dest(dest));
});

gulp.task('wp', function () {
    return gulp.src('src/app/main.js')
        .pipe(wpstream({
            resolve: {
                root: [path.join(__dirname, "bower_components")]
            },
            plugins: [
                new webpack.ResolverPlugin(
                    new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
                )
            ],
            module: {
                loaders: [
                    {test: /\.css$/, loaders: ["style", "css"]},
                    {test: /\.less$/, loaders: ["style", "css", "less"]}
                ]
            },
            output: {
                filename: 'bundle.js'
            }
        }))
        .pipe(gulp.dest('dist/'));
});

gulp.task('build', ['clean'], function() {
    return gulp.run('copy');
});

gulp.task('copy', ['wp', 'js', 'css', 'static']);

gulp.task('serve-dev', serve({
    port: 9000
}));

gulp.task('serve-prod', serve({
    root: 'dist',
    port: 8081
}));

gulp.task('serve', ['build'], function() {
    return gulp.run('serve-prod');
});

gulp.task('clean', function () {
    return gulp.src(dest, {read: false})
            .pipe(clean());
});

gulp.task('static', ['clean'], function () {
    return gulp.src('src/index.html')
        .pipe(gulp.dest(dest));
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