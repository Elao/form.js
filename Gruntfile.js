var files = {
  jquery: [
    'src/jquery.js'
  ],
  collection: [
    'src/collection/*.js',
  ],
  choice: [
    'src/choice/*.js',
  ],
  change_confirmation: [
    'src/change_confirmation/*.js',
  ],
  helper: [
    'src/helper/*.js',
  ]
};

module.exports = function(grunt) {

  // Configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    banner: [
      '/*!',
      ' * <%= pkg.name %> <%= pkg.version %>',
      ' * http://github.com/Elao/form.js',
      ' * Copyright 2014 Elao and other contributors; Licensed MIT',
      ' */\n'
    ].join('\n'),

    concat: {
      dist: {
        src:  [].concat(files.helper, files.collection, files.choice, files.change_confirmation, files.jquery),
        dest: 'dist/form.js'
      }
    },

    umd: {
      dist: {
        src:    '<%= concat.dist.dest %>',
        indent: '    ',
        deps:   {
          'default': ['$'],
          amd:       ['jquery'],
          cjs:       ['jquery'],
          global:    ['jQuery']
        }
      }
    },

    usebanner: {
      dist: {
        options: {
          banner: '<%= banner %>'
        },
        files: {
          src: '<%= concat.dist.dest %>'
        }
      }
    },

    uglify: {
      min: {
        options: {
          preserveComments: 'some'
        },
        files: {
          'dist/form.min.js': '<%= concat.dist.dest %>'
        }
      }
    },

    jshint: {
      src:       'src/**/*.js',
      gruntfile: ['Gruntfile.js']
    },

    watch: {
      scripts: {
        files:   'src/**/*.js',
        tasks:   ['build'],
        options: {
          interrupt: true,
          atBegin:   true
        }
      }
    }

  });

  // Plugins
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-umd');
  grunt.loadNpmTasks('grunt-banner');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // Tasks
  grunt.registerTask('default', 'build');
  grunt.registerTask('build', ['jshint', 'concat', 'umd', 'usebanner', 'uglify']);
  grunt.registerTask('lint', 'jshint');
};
