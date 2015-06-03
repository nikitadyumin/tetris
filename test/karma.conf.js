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
            'app/**/*.js': 'coverage'
        },

        reporters: ['progress', 'coverage', 'dots', 'junit'],

        junitReporter: {
            outputFile: 'test-reports/test-results.xml',
            suite: ''
        },

        coverageReporter: {
            dir: 'test-reports',
            reporters: [
                {type: 'html', subdir: 'report-html'},
                {type: 'cobertura', subdir: '.', file: '../cobertura.txt'}
            ]
        },

        port: 9876,

        colors: true,

        logLevel: config.LOG_WARN,

        autoWatch: true,

        browsers: ['Chrome'],

        captureTimeout: 60000,

        singleRun: true
    });
};
