module.exports = function(grunt) {
  grunt.initConfig({
    jshint: {
      options: {
        jshintrc: true
      },
      all: ['Gruntfile.js', 'main.js', 'renderer.js']
    },
    watch: {
      scripts: {
        files: ['main.js', 'renderer.js'],
        tasks: ['jshint', 'restart-electron']
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['jshint']);
  grunt.registerTask('restart-electron', function() {
    var exec = require('child_process').execSync;
    var result = exec('tskill electron');
    grunt.log.writeln(result);
    var result2 = exec('electron .');
  });
};
