module.exports = function(grunt) {

    // 1. All configuration goes here
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // Grunt-sass
        sass: {
          app: {
            files: [{
              expand: true,
              cwd: 'scss',
              src: ['*.scss'],
              dest: 'css',
              ext: '.css'
            }]
          },
          options: {
            sourceMap: true,
            outputStyle: 'nested',
            imagePath: "images",
          }
        },

        watch: {
            scss: {
                files: ['scss/**/*.scss'],
                tasks: ['sass']
            },
            css: {
                files: ['css/**/*.css']
            },
            js: {
                files: ['js/**/*.js','!js/dist/**/*.js'],
                tasks: ['jshint']
            },
            livereload: {
                files: ['**/*.html', '**/*.php', '**/*.js', '**/*.css', '!**/node_modules/**'],
                options: { livereload: true }
            }
        },

        browserSync: {
            files: {
                src : 'css/style.css'
            },
            options: {
                watchTask: true // < VERY important
            }
        },

        autoprefixer: {
            dist: {
                files: {
                    'css/style.css' : 'css/style.css'
                }
            }
        },

        cmq: {
            your_target: {
                files: {
                    'css' : 'css/style.css'
                }
            }
        },

        cssmin: {
            combine: {
                files: {
                    'css/style.min.css': ['css/style.css']
                }
            }
        },

        jshint: {
            all: [
                'js/*.js',
            ],
            options: {
                jshintrc: 'js/.jshintrc'
            }
        },

        concat: {
            footer: {
                src: [
                    'js/libs/*.js', // All JS in the libs folder
                    'js/scripts.js',  // This specific file
                    '!js/libs/modernizr.custom.min.js'
                ],
                dest: 'js/dist/main.js',
            }
        },

        uglify: {
            footer: {
                src: 'js/dist/main.js',
                dest: 'js/dist/main.min.js'
            }
        },

        imagemin: {
            dynamic: {
                files: [{
                    expand: true,
                    cwd: 'images/',
                    src: ['**/*.{png,jpg,gif,svg,ico}'],
                    dest: 'images/'
                }]
            }
        },

        concurrent: {
            watch: {
                tasks: ['watch', 'sass', 'browserSync'],
                options: {
                    logConcurrentOutput: true
                }
            }
        },

        copy: {
          main: {
            files: [
              // includes files within path
              // {expand: true, src: ['path/*'], dest: 'dest/', filter: 'isFile'},

              // includes files within path and its sub-directories
              {expand: true, src: ['**','!build/**','!bower_components/**','!node_modules/**','!.git/**'], dest: 'build/'},

              // makes all src relative to cwd
              // {expand: true, cwd: 'path/', src: ['**'], dest: 'dest/'},

              // flattens results to a single level
              // {expand: true, flatten: true, src: ['path/**'], dest: 'dest/', filter: 'isFile'},
            ],
          },
        },
    });

    // 3. Where we tell Grunt what plugins to use

    // Sass
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-combine-media-queries');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    // JS
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');

    // Images
    grunt.loadNpmTasks('grunt-contrib-imagemin');

    // Browser Reload + File Watch
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-browser-sync');

    // Build Related
    grunt.loadNpmTasks('grunt-contrib-copy');

    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
    grunt.registerTask('init', ['build']);
    grunt.registerTask('dev', ['browserSync','watch']);
    grunt.registerTask('build', ['sass', 'autoprefixer', 'cmq', 'cssmin', 'concat', 'uglify', 'copy']);
};