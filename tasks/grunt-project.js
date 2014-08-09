module.exports = function (grunt) {
  grunt.registerMultiTask('project', 'Creates new project by copying template',
  function () {
    var options = this.options();

    this.files.forEach(function (filePair) {
      filePair.src.forEach(function (src) {
        grunt.file.copy(options.template, filePair.dest);
        grunt.log.writeln(
          'Writing ' + filePair.dest['cyan'] +
          '...' + 'OK'['green']
        );
      });
    });
  });

};
