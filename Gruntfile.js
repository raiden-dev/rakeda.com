module.exports = function (grunt) {
  var path = require('path');

  function unflatten(dest, src) {
    var name = src.match(/([^\\/]+)(\.[^\\/]+$)/);
    return path.join(dest, name[1], name[0]);
  }

  grunt.task.loadTasks('tasks');

  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-wrap');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-newer');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: [
      'blocks/**/*.hbs',
      'blocks/**/*.yml',
      'public/js/',
      'public/templates/',
      'public/css/',
      'public/index.html'
    ],

    project: {
      create: {
        options: {
          template: 'blocks/mega/mega.html'
        },
        files: [
          {
            expand: true,
            cwd: 'data/projects/',
            src: ['**/*.yml'],
            dest: 'blocks/',
            ext: '.html',
            rename: unflatten
          }
        ]
      }
    },

    bundlebars: {
      blocks: {
        files: [
          {
            expand: true,
            cwd: 'blocks/',
            src: ['**/*.html', '!index.html'],
            dest: 'blocks/',
            ext: '.hbs'
          }
        ]
      },

      index: {
        options: {
          partialsPath: 'blocks/'
        },
        files: {
          'public/index.html': ['blocks/index.html']
        }
      },

      templates: {
        options: {
          precompile: true
        },
        files: [
          {
            expand: true,
            cwd: 'blocks/',
            src: ['**/*.hbs'],
            dest: 'public/templates',
            ext: '.js',
            flatten: true
          }
        ]
      }
    },

    htmlmin: {
      index: {
        options: {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          removeEmptyAttributes: true,
          collapseBooleanAttributes: true,
          minifyJS: true
        },
        files: {
          'public/index.html': 'public/index.html'
        }
      },

      blocks: {
        options: {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          removeEmptyAttributes: true,
          collapseBooleanAttributes: true,
          minifyJS: true
        },
        files: [
          {
            expand: true,
            cwd: 'blocks/',
            src: ['**/*.hbs'],
            dest: 'blocks/',
            ext: '.hbs'
          }
        ]
      }
    },

    stylus: {
      prod: {
        options: {
          compress: true
        },
        files: {
          'public/css/styles.css': 'blocks/styles.styl'
        }
      },

      dev: {
        options: {
          compress: false
        },
        files: {
          'public/css/styles.css': 'blocks/styles.styl'
        }
      }
    },

    wrap: {
      handlebars: {
        options: {
          wrapper: ['define(function(){', ';return window.Handlebars=Handlebars;});']
        },
        files: {
          'public/js/lib/handlebars.js': 'bower_components/handlebars/handlebars.min.js'
        }
      },

      underscore: {
        options: {
          wrapper: ['define(function(){', ';return _;});']
        },
        files: {
          'public/js/lib/underscore.js': 'bower_components/underscore/underscore.min.js'
        }
      },

      templates: {
        options: {
          wrapper: ['define(["handlebars"],function(Handlebars){return Handlebars.template(', ');});']
        },
        files: [
          {
            expand: true,
            cwd: 'public/templates',
            src: ['**/*.js'],
            dest: 'public/templates',
            ext: '.js',
            flatten: true
          }
        ]
      }
    },

    uglify: {
      lib: {
        files: {
          'public/js/lib/require.js': 'bower_components/requirejs/require.js',
          'public/js/lib/backbone.js': 'bower_components/backbone/backbone.js',
          'bower_components/underscore/underscore.min.js': 'bower_components/underscore/underscore.js'
        }
      },

      src: {
        options: {
          sourceMap: true,
          sourceMapIncludeSources: true
        },
        files: [
          {
            expand: true,
            cwd: 'src/',
            src: ['**/*.js'],
            dest: 'public/js',
            ext: '.js'
          }
        ]
      },

      templates: {
        files: [
          {
            expand: true,
            cwd: 'public/templates',
            src: ['**/*.js'],
            dest: 'public/templates',
            ext: '.js',
            flatten: true
          }
        ]
      }
    },

    copy: {
      'data-blocks': {
        files: [
          {
            expand: true,
            cwd: 'data/',
            src: ['**/*.yml', '!index.yml'],
            dest: 'blocks/',
            rename: unflatten
          }
        ]
      },

      'data-index': {
        files: {
          'blocks/index.yml': 'data/index.yml'
        }
      },

      lib: {
        files: {
          'public/js/lib/jquery.js': 'bower_components/jquery/dist/jquery.min.js'
        }
      },

      src: {
        files: [
          {
            expand: true,
            cwd: 'src/',
            src: ['**/*.js'],
            dest: 'public/js',
            ext: '.js'
          }
        ]
      }
    },

    watch: {
      index: {
        files: ['blocks/index.html', 'blocks/index.json', 'data/index.yml'],
        tasks: ['copy:data-index', 'bundlebars:index', 'htmlmin:index'],
        options: {
          spawn: false
        }
      },

      blocks: {
        files: ['blocks/**/*.html', 'blocks/**/*.json', 'data/**/*.yml'],
        tasks: ['copy:data-blocks', 'bundlebars', 'htmlmin:blocks', 'wrap:templates', 'uglify:templates'],
        options: {
          spawn: false
        }
      },

      src: {
        files: ['src/**/*.js'],
        tasks: ['bundlebars:index', 'htmlmin:index', 'newer:uglify:src'],
        options: {
          spawn: false
        }
      },

      css: {
        files: ['blocks/**/*.styl'],
        tasks: ['bundlebars:index', 'htmlmin:index', 'stylus:dev'],
        options: {
          spawn: false
        }
      }
    }
  });

  grunt.registerTask('default', ['clean', 'copy:data-blocks', 'copy:data-index', 'project', 'bundlebars', 'htmlmin', 'stylus:prod', 'copy', 'uglify:lib', 'uglify:src', 'wrap', 'uglify:templates']);

};
