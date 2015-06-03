module.exports = function (config) {
    config.set({
        basePath: '../',

        frameworks: ['requirejs', 'jasmine-ajax', 'jasmine'],

        files: [
            {pattern: 'bower_components/**/*.js', included: false, served: true},
            {pattern: 'src/app/**/*.js', included: false, served: true},
            {pattern: 'test/**/*Spec.js', included: false},
            'test/spec/main.js'
        ],

        preprocessors: {
            'src/**/*.js': ['coverage']
        },

        reporters: ['progress', 'coverage', 'junit'],

        junitReporter: {
            outputFile: 'test-reports/test-results.xml',
            suite: ''
        },

        coverageReporter: {
            dir: 'test-reports',
            reporters: [
                {type: 'html', subdir: 'report-html'},
                {type: 'lcovonly', subdir: '.', file: 'lcov.info'}
            ]
        },

        port: 9876,

        colors: true,

        logLevel: config.LOG_WARN,

        autoWatch: true,

        browsers: ['PhantomJS'],

        captureTimeout: 60000,

        singleRun: true
    });
};
