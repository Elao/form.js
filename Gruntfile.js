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
  helper: [
    'src/helper/*.js',
  ]
};

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    package: grunt.file.readJSON('package.json'),

    banner: [
      '/*!',
      ' * <%= package.name %> <%= package.version %>',
      ' * http://github.com/Elao/form.js',
      ' * Copyright 2014 Elao and other contributors; Licensed MIT',
      ' */\n\n'
    ].join('\n'),

    uglify: {
      min: {
        options: {
          banner: '<%= banner %>',
          enclose: { 'jQuery': '$' }
        },
        files: {
          'dist/form.min.js': [].concat(files.helper, files.collection, files.choice, files.jquery),
        }
      },
      full: {
        options: {
          banner: '<%= banner %>',
          enclose: { 'jQuery': '$' },
          preserveComments: 'all',
          beautify: true,
          mangle: false,
          compress: false
        },
        files: {
          'dist/form.js': [].concat(files.helper, files.collection, files.choice, files.jquery),
        }
      }
    },
    jshint: {
      src: 'src/**/*.js',
      gruntfile: ['Gruntfile.js']
    },
    watch: {
      scripts: {
        files: 'src/**/*.js',
        tasks: ['build'],
        options: {
          interrupt: true,
          atBegin: true
        },
      },
    },
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // Default task(s).
  grunt.registerTask('default', 'build');
  grunt.registerTask('build', ['jshint', 'uglify']);
  grunt.registerTask('lint', 'jshint');
};