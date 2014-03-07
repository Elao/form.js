var files = {
  jquery: [
    'src/jquery.js'
  ],
  collection: [
    'src/collection/Collection.js',
    'src/collection/CollectionItem.js'
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
      options: {
        banner: '<%= banner %>',
        enclose: { 'jQuery': '$' }
      },
      build: {
        src: [].concat(files.collection, files.jquery),
        dest: 'dist/form.js'
      }
    },
    jshint: {
      src: 'src/**/*.js',
      gruntfile: ['Gruntfile.js']
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // Default task(s).
  grunt.registerTask('default', 'build');
  grunt.registerTask('build', 'uglify');
  grunt.registerTask('lint', 'jshint');
};