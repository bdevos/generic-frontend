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
    tmp: '.tmp'
  };

  var serverPort = grunt.option('serverPort') || 9021;
  var reloadPort = grunt.option('reloadPort') || 35729;
  var hostname = grunt.option('hostname') || '0.0.0.0';

  var lrSnippet = require('connect-livereload')({ port: reloadPort });
  var proxySnippet = require('grunt-connect-proxy/lib/utils').proxyRequest;

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
      proxies: [
        {
          context: '/api',
          host: 'localhost',
          port: 9101,
          https: false,
          changeOrigin: true
        }
      ],
      options: {
        port: serverPort,
        hostname: hostname
      },
      livereload: {
        options: {
          middleware: function (connect) {
            return [
              proxySnippet,
              lrSnippet,
              mountFolder(connect, config.tmp),
              mountFolder(connect, config.app)
            ];
          }
        }
      },
      dist: {
        options: {
          middleware: function (connect) {
            return [
              proxySnippet,
              mountFolder(connect, config.dist)
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
      app: [parent(config.app) + '/coverage'],
      dist: config.dist,
      runtime: [config.tmp, '.sass-cache', 'coverage']
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      app: [
        '<%= yeoman.app %>/scripts/{,*/}*.js',
      ]
    },
    karma: {
      e2e: {
        configFile: 'karma-e2e.conf.js',
        singleRun: true
      },
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
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
    ngtemplates: {
      app: {
        options: {
          base: '<%= yeoman.app %>',
          module: 'p3WebApp',
          concat: 'dist/scripts/scripts.js',
          htmlmin: {
            collapseBooleanAttributes: true,
            collapseWhitespace: true,
            removeAttributeQuotes: true,
            removeComments: true,
            removeEmptyAttributes: false,
            removeRedundantAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true
          }
        },
        src: [ '<%= yeoman.app %>/views/**.html', '<%= yeoman.app %>/views/**/**.html'],
        dest: '<%= yeoman.tmp %>/scripts/templates.js'
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
      dist: {},
      server: {
        options: {
          debugInfo: true
        }
      }
    },
    copy: {
      app: {
        files: [
          {
            expand: true,
            dot: true,
            cwd: '<%= yeoman.app %>',
            dest: '<%= yeoman.dist %>',
            src: [
              '*.{ico,png,txt}',
              '.htaccess',
              'bower_components/**/*',
              'images/{,*/}*.{gif,webp,svg}'
            ]
          },
          {
            expand: true,
            cwd: '.tmp/images',
            dest: '<%= yeoman.dist %>/images',
            src: [
              'generated/*'
            ]
          }
        ]
      }
    },
    useminPrepare: {
      html: '<%= yeoman.app %>/index.html',
      options: {
        dest: '<%= yeoman.dist %>'
      }
    },
    imagemin: {
      app: {
        files: [
          {
            expand: true,
            cwd: '<%= yeoman.app %>/images',
            src: '{,*/}*.{png,jpg,jpeg}',
            dest: '<%= yeoman.dist %>/images'
          }
        ]
      }
    },
    svgmin: {
      dist: {
        files: [
          {
            expand: true,
            cwd: '<%= yeoman.app %>/images',
            src: '{,*/}*.svg',
            dest: '<%= yeoman.dist %>/images'
          }
        ]
      }
    },
    htmlmin: {
      app: {
        files: [
          {
            expand: true,
            cwd: '<%= yeoman.app %>',
            src: '*.html',
            dest: '<%= yeoman.dist %>'
          }
        ]
      }
    },
    cdnify: {
      dist: {
        html: ['<%= yeoman.dist %>/*.html']
      }
    },
    ngmin: {
      dist: {
        files: [
          {
            expand: true,
            cwd: '<%= yeoman.dist %>/scripts',
            src: '*.js',
            dest: '<%= yeoman.dist %>/scripts'
          }
        ]
      }
    },
    cssmin: {
      dist: {
        files: {
          '<%= yeoman.dist %>/styles/main.css': [
            '<%= yeoman.tmp %>/styles/main.css',
            '<%= yeoman.dist %>/styles/main.css'
          ]
        }
      }
    },
    uglify: {
      dist: {
        files: {
          '<%= yeoman.dist %>/scripts/scripts.js': [
            '<%= yeoman.dist %>/scripts/scripts.js'
          ]
        }
      }
    },
    rev: {
      dist: {
        files: {
          src: [
            '<%= yeoman.dist %>/scripts/{,*/}*.js',
            '<%= yeoman.dist %>/styles/{,*/}*.css',
            '<%= yeoman.dist %>/images/*.{png,jpg,jpeg,gif,webp,svg}'
          ]
        }
      }
    },
    usemin: {
      html: ['<%= yeoman.dist %>/{,*/}*.html'],
      css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
      options: {
        dirs: ['<%= yeoman.dist %>']
      }
    }
  });

  grunt.registerTask('server', function (target) {
    if (target === 'dist') {
      return grunt.task.run([
        'build',
        'open',
        'configureProxies',
        'connect:dist:keepalive'
      ]);
    }

    grunt.task.run([
      'clean:runtime',
      'useminPrepare',
      'ngtemplates:app',
      'configureProxies',
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
    'karma:unit'
  ]);

  grunt.registerTask('test:e2e', [
    'clean',
    'compass',
    'karma:e2e'
  ]);

  grunt.registerTask('build', [
    'clean',
    'useminPrepare',
    'jshint:app',
    'ngtemplates:app',
    'concat',
    'compass',
    'copy',
    'autoprefixer',
    'imagemin',
    'htmlmin',
    'cdnify',
    'ngmin',
    'cssmin',
    'uglify',
    'rev',
    'usemin',
  ]);

  grunt.registerTask('local', [
    'jshint:app',
    'test'
  ]);

  grunt.registerTask('default', [
    'local',
    'build'
  ]);
};
