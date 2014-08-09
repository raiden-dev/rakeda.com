module.exports = function (grunt) {
  var path = require('path');

  var Handlebars = require('handlebars'),
      helpers = require('../src/hbs/helpers.js'),
      yaml = require('js-yaml');

  helpers.register(Handlebars);

  function compile(src, data) {
    var template = Handlebars.compile(src);
    return template(data);
  }

  function precompile(src) {
    var ast = Handlebars.parse(src);
    return Handlebars.precompile(ast);
  }

  grunt.registerMultiTask('bundlebars', '“Bundlebars” dirty implemetation',
  function () {
    var options = this.options(),
        files = this.files;

    function process(src) {
      var contents = grunt.file.read(src),
          data = null,
          results = '';

      // Precompile without data and partials
      if (options.precompile) {
        results += precompile(contents);
        return results;
      }

          // Src
      var srcName = src.match(/([^\\/]+)(\.[^\\/]+$)/),
          srcPath = src.replace(srcName[0], ''),

          // Data
          dataExt = options.dataExt,
          dataPath = options.dataPath,

          // Partial
          partialsPath = options.partialsPath,
          partialExt = options.partialExt,

          rePartialsNames = /[^\\]\{\{>[\s'"]*([^\s'"\}]+)/g,
          partialsNames = [],
          match = null;

      // Set defaults
      if (!partialsPath) {
        partialsPath = srcPath.replace(new RegExp(srcName[1] + '[\\/]?'), '');
      }

      if (!partialExt) {
        partialExt = srcName[2];
      }

      if (!dataExt) {
        if (grunt.file.exists(path.join(srcPath, srcName[1] + '.yml'))) {
          dataExt = '.yml';
        }
        else {
          dataExt = '.json';
        }
      }

      if (!dataPath) {
        dataPath = srcPath;
      }

      // Try to get data
      try {
        data = grunt.file.read(path.join(dataPath + srcName[1] + dataExt));
      }
      catch (ex) {}

      // Parse data, fails with invalid data
      if (data) {
        switch (dataExt) {
          case '.json':
            try {
              data = JSON.parse(data);
            }
            catch (ex) {
              grunt.fail.fatal(ex);
            }
            break;

          case '.yaml':
          case '.yml':
            try {
              data = yaml.safeLoad(data);
            }
            catch (ex) {
              grunt.fail.fatal(ex);
            }
            break;
        }
      }
      else {
        data = {};
      }

      // Get partials names
      while (match = rePartialsNames.exec(contents)) {
        partialsNames.push(match[1]);
      }

      // Process partials
      partialsNames.forEach(function (name) {
        var results = process(path.join(partialsPath, name, name + partialExt));
        Handlebars.registerPartial(name, results);
      });

      // Process template
      results += compile(contents, data);

      return results;
    }

    files.forEach(function (filePair) {
      filePair.src.forEach(function (src) {
        var results = process(src);

        grunt.log.writeln(
          'Writing ' + filePair.dest['cyan'] +
          '...' + 'OK'['green']
        );

        grunt.file.write(filePair.dest, results);
      });
    });

  });

};
