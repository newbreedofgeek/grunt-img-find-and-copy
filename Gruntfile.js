/*
 * grunt-img-find-and-copy
 *
 * Copyright (c) 2015 newbreedofgeek
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {
  // load all npm grunt tasks
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    clean: {
      build: ['build/*']
    },

    img_find_and_copy: {
      resources: {
        files: {
          'build1': ['css/**/*.css', '*.html']
        }
      }
    },

    copy: {
      main: {
        files: [
          {
            expand: true, src: ['*.html', 'css/**/*.css'], dest: 'build/', filter: 'isFile'
          }
        ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadTasks('tasks');

  grunt.registerTask('default', ['clean', 'img_find_and_copy', 'copy']);

};
