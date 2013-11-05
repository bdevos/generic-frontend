// Karma configuration

// base path, that will be used to resolve files and exclude
basePath = 'app';

// list of files / patterns to load in the browser
files = [
  JASMINE,
  JASMINE_ADAPTER,
  'bower_components/angular/angular.js',
  'bower_components/angular-i18n/angular-locale_nl-nl.js',
  'bower_components/angular-route/angular-route.js',
  'bower_components/angular-resource/angular-resource.js',
  'bower_components/angular-sanitize/angular-sanitize.js',
  'bower_components/angular-touch/angular-touch.js',
  'bower_components/angular-mocks/angular-mocks.js',
  'bower_components/generic-frontend/eb-question-choice/eb-question-choice.js',
  'scripts/*.js',
  'scripts/**/*.js',
  '../test/spec/**/*.js',
  'views/**/*.html'
];

preprocessors = {
  'scripts/**/*.js': 'coverage',
  'views/**/*.html': 'html2js'
};

// list of files to exclude
exclude = [];

// test results reporter to use
// possible values: dots || progress || growl
reporters = ['dots', 'junit', 'coverage'];

junitReporter = {
  outputFile: '../target/surefire-reports/TEST-karma.xml'
};

coverageReporter = {
  type : 'lcov',
  dir : '../target/coverage/'
}

// web server port
port = 8080;

// cli runner port
runnerPort = 9100;

// enable / disable colors in the output (reporters and logs)
colors = false;

// level of logging
// possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
logLevel = LOG_INFO;

// enable / disable watching file and executing tests whenever any file changes
autoWatch = false;

// Start these browsers, currently available:
// - Chrome
// - ChromeCanary
// - Firefox
// - Opera
// - Safari (only Mac)
// - PhantomJS
// - IE (only Windows)
browsers = ['PhantomJS'];

// If browser does not capture in given timeout [ms], kill it
captureTimeout = 5000;

// Continuous Integration mode
// if true, it capture browsers, run tests and exit
singleRun = true;
