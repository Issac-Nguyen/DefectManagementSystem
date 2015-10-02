'use strict';
var request = require('request');

module.exports = function(grunt) {
  // show elapsed time at the end
  require('time-grunt')(grunt);
  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  var reloadPort = 35729,
    files,
    watchFiles = {
      all: [
        'app.js',
        'app/**/*.js',
        'config/*.js'
      ],
      mochaTests: ['test/**/*.js']
    };

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    develop: {
      server: {
        file: 'app.js'
      }
    },
    jshint: {
      all: {
        src: watchFiles.all,
        options: {
          jshintrc: true
        }
      }
    },
    nodemon: {
      dev: {
        script: 'app.js',
        options: {
          nodeArgs: ['--debug'],
          ext: 'js,html',
          watch: watchFiles.all
        }
      }
    },
    'node-inspector': {
     custom: {
       options: {
         'web-port': 1337,
         'web-host': 'localhost',
         'debug-port': 5858,
         'save-live-edit': true,
         'no-preload': true,
         'stack-trace-limit': 50,
         'hidden': []
       }
     }
    },
    concurrent: {
     default: ['nodemon'],
     debug: ['nodemon', 'node-inspector'],
     options: {
       logConcurrentOutput: true
     }
    },
    env: {
      test: {
        NODE_ENV: process.env.NODE_ENV || 'test'
      },
      testCodeship: {
        NODE_ENV: 'codeship'
      }
    },
    mochaTest: {
      src: watchFiles.mochaTests,
      options: {
        reporter: 'spec',
        timeout: 10000,
        ui: 'bdd'
      }
    }
  });

  // Making grunt default to force in order not to break the project.
  grunt.option('force', true);

  // Default task(s).
  grunt.registerTask('default', ['concurrent:default']);

  // Debug task.
  grunt.registerTask('debug', ['lint', 'concurrent:debug']);

  // Lint task(s).
  grunt.registerTask('lint', ['jshint']);

  // Build task(s).
  grunt.registerTask('build', ['lint', 'test']);

  // Test task.
  grunt.registerTask('test', ['env:test', 'mochaTest']);

};