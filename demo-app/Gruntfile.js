'use strict';

var mountFolder = function(connect, dir) {
  return connect.static(require('path').resolve(dir));
};
var parent = function(child) {
  return child.substring(0, child.lastIndexOf('/'));
};

module.exports = function (grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // configurable paths
  var config = {
    app: 'app',
    dist: 'dist',
    tmp: '.tmp',
    components: '../components'
  };

  var serverPort = grunt.option('serverPort') || 9021;
  var reloadPort = grunt.option('reloadPort') || 35729;
  var hostname = grunt.option('hostname') || '0.0.0.0';

  var lrSnippet = require('connect-livereload')({ port: reloadPort });

  grunt.initConfig({
    yeoman: config,
    watch: {
      compass: {
        files: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
        tasks: ['compass', 'autoprefixer']
      },
      livereload: {
        options: {
          livereload: reloadPort
        },
        files: [
          '<%= yeoman.app %>/{,*/}*.html',
          '<%= yeoman.tmp %>/styles/{,*/}*.css',
          '<%= yeoman.app %>/styles/{,*/}*.css',
          '<%= yeoman.tmp %>/scripts/{,*/}*.js',
          '<%= yeoman.app %>/scripts/{,*/}*.js',
          '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },
    connect: {
      options: {
        port: serverPort,
        hostname: hostname
      },
      livereload: {
        options: {
          middleware: function (connect) {
            return [
              lrSnippet,
              mountFolder(connect, config.tmp),
              mountFolder(connect, config.app),
              mountFolder(connect, config.components)
            ];
          }
        }
      },
      test: {
        options: {
          port: 9121,
          middleware: function (connect) {
            return [
              mountFolder(connect, config.tmp),
              mountFolder(connect, config.components),
              mountFolder(connect, 'test')
            ];
          }
        }
      }
    },
    open: {
      server: {
        url: 'http://localhost:<%= connect.options.port %>'
      }
    },
    clean: {
      runtime: [config.tmp, '.sass-cache']
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      app: [
        '<%= yeoman.app %>/scripts/{,*/}*.js',
        '<%= yeoman.components %>/{,*/}*.js'
      ]
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js'
      },
      continuous: {
        configFile: 'karma.conf.js',
        singleRun: false,
        autoWatch: true
      }
    },
    autoprefixer: {
      options: ['last 1 version'],
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.tmp %>/styles/',
          src: '{,*/}*.css',
          dest: '<%= yeoman.tmp %>/styles/'
        }]
      }
    },
    compass: {
      options: {
        cssDir: '<%= yeoman.tmp %>/styles',
        generatedImagesDir: '<%= yeoman.tmp %>/images/generated',
        sassDir: '<%= yeoman.app %>/styles',
        imagesDir: '<%= yeoman.app %>/images',
        javascriptsDir: '<%= yeoman.app %>/scripts',
        importPath: '<%= yeoman.app %>/bower_components',
        httpImagesPath: '/images',
        httpGeneratedImagesPath: '/images/generated',
        relativeAssets: false,
        require: './compass/extensions/base64_encode.rb'
      },
      server: {
        options: {
          debugInfo: true
        }
      }
    },
    useminPrepare: {
      html: '<%= yeoman.app %>/index.html',
      options: {
        dest: '<%= yeoman.dist %>'
      }
    }
  });

  grunt.registerTask('server', function (target) {
    grunt.task.run([
      'clean:runtime',
      'useminPrepare',
      'compass',
      'autoprefixer',
      'connect:livereload',
      'open',
      'watch'
    ]);
  });

  grunt.registerTask('test', [
    'clean',
    'compass',
    'connect:test',
    'karma:continuous'
  ]);

  grunt.registerTask('build', [
    'clean',
    'useminPrepare',
    'jshint:app',
    'compass',
    'autoprefixer',
    'connect:test',
    'karma:unit'
  ]);

  grunt.registerTask('default', [
    'build'
  ]);
};
