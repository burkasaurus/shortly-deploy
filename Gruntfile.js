module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      },
      target: {
        src: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
        ],
        dest: 'public/dist/prod.js'
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    uglify: {
      target: {
        files: {
          'public/dist/prod.min.js': ['public/dist/prod.js']
        }
      }
    },

    eslint: {
      options: {
        configFile: '.eslintrc.js'
      },
      target: [
        '**/*.js'
      ]
    },

    cssmin: {
      files: {
        src: ['public/*.css'],
        dest: 'public/dist/styles.min.css'
      }
    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
        ],
        tasks: [
          'concat',
          'uglify'
        ]
      },
      css: {
        files: ['public/*.css'],
        tasks: ['cssmin']
      }
    },

    concurrent: {
      options: {
        logConcurrentOutput: true
      },
      devServer: [
        'nodemon',
        'watch'
      ]
    },

    shell: {
      prodServer: {
        command: 'git push live master'
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-concurrent');

  grunt.registerTask('server-dev', function (target) {
    grunt.task.run([ 'build', 'concurrent' ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'mochaTest'
  ]);

  grunt.registerTask('build', [
    'concat',
    'uglify',
    'cssmin'
  ]);

  grunt.registerTask('deploy', function(n) {
    if (grunt.option('prod')) {
      grunt.task.run(['test', 'shell']);
    } else {
      grunt.task.run(['server-dev']);
    }
  });

};
