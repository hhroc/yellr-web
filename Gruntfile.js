module.exports = function(grunt) {

    'use strict';
    grunt.util.linefeed = '\n';  // Force use of Unix newlines

    // project directory layout
    var project = {
        images_dir: 'images',
        jade_dir: 'jade/',
        sass_dir: 'style/',
        sass_filename: 'style.scss',
        sass_assets: 'style/assets',
        js_libs_dir: 'js/vendor',
        js_files: [
            'js/frontpage/init.js',
            'js/frontpage/submit.js',
        ],
        output: {
            folder:                 './',
            css_folder:                 'style/',
            css_filename:                   'frontpage.css',
            css_filename_minified:          'frontpage.min.css',
            js_folder:                  'js/',
            js_filename:                    'frontpage.js',
            js_filename_minified:           'frontpage.min.js'
        }
    };





    // Project configuration.
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        project: project,

        banner: '/*!\n' +
                ' * <%= pkg.name %> v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
                ' * Copyright 2014-<%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
                ' * Licensed under <%= pkg.license.type %> (<%= pkg.license.url %>)\n' +
                ' */\n',


        // JS
        // ----------------------------------------
        // 1. concat
        concat: {
            options: {
                stripBanners: false,
            },
            build: {
                src: '<%= project.js_files %>',
                dest: '<%= project.output.folder %><%= project.output.js_folder %><%= project.output.js_filename %>'
            }
        },

        // 2. minify
        uglify: {
            options: {
                preserveComments: 'none'
            },
            build: {
                src: '<%= project.output.folder %><%= project.output.js_folder %><%= project.output.js_filename %>',
                dest: '<%= project.output.folder %><%= project.output.js_folder %><%= project.output.js_filename_minified %>'
            }
        },




        // CSS
        // ----------------------------------------
        // 1. build
        sass: {
            options: {
                outputStyle: 'expanded'
            },
            build: {
                files: {
                    '<%= project.output.folder %><%= project.output.css_folder %><%= project.output.css_filename %>':
                        '<%= project.sass_dir %><%= project.sass_filename %>'
                }
            }
        },

        // 2. autoprefix
        autoprefixer: {
            options: {
                browsers: [
                    'Android 2.3',
                    'Android >= 4',
                    'Chrome >= 20',
                    'Firefox >= 24',
                    'Explorer >= 8',
                    'iOS >= 6',
                    'Opera >= 12',
                    'Safari >= 6'
                ]
            },
            build: {
                options: {
                    map: false
                },
                src:'<%= project.output.folder %><%= project.output.css_folder %><%= project.output.css_filename %>'
            }
        },

        // 3. comb
        csscomb: {
            options: {
                config: 'style/.csscomb.json'
            },
            build: {
                src: ['<%= project.output.folder %><%= project.output.css_folder %><%= project.output.css_filename %>'],
                dest: '<%= project.output.folder %><%= project.output.css_folder %><%= project.output.css_filename %>'
            }
        },


        // 4. lint
        csslint: {
            options: {
                csslintrc: 'style/.csslintrc'
            },
            build: ['<%= project.output.folder %><%= project.output.css_folder %><%= project.output.css_filename %>']
        },

        // 5. minify
        cssmin: {
            options: {
                compatibility: 'ie8',
                keepSpecialComments: '*',
                noAdvanced: true
            },
            build: {
                src: ['<%= project.output.folder %><%= project.output.css_folder %><%= project.output.css_filename %>'],
                dest: '<%= project.output.folder %><%= project.output.css_folder %><%= project.output.css_filename_minified %>'
            }
        },



        // HTML
        // ----------------------------------------
        // 1. compile
        jade: {
            build: {
                options: {
                    compileDebug: false,
                    pretty: true,
                },
                files: [
                    {
                        expand: true,
                        cwd: '<%= project.jade_dir %>',
                        src: [
                            '!_*.jade',
                            '*.jade'
                        ],
                        dest: '<%= project.output.folder %>',
                        ext: '.html',
                        flatten: true
                    }
                ]
            }
        },



        // Utils
        // ----------------------------------------
        // banners
        usebanner: {
            options: {
                position: 'top',
                banner: '<%= banner %>'
            },
            build: {
                src: [
                    '<%= project.output.folder %><%= project.output.css_folder %><%= project.output.css_filename %>',
                    '<%= project.output.folder %><%= project.output.css_folder %><%= project.output.css_filename_minified %>',
                    '<%= project.output.folder %><%= project.output.js_folder %><%= project.output.js_filename %>',
                    '<%= project.output.folder %><%= project.output.js_folder %><%= project.output.js_filename_minified %>'
                ]
            }
        },

        // watch file changes
        watch: {
            sass: {
                files: ['style/*.scss','style/**/*.scss'],
                tasks: ['sass:build', 'autoprefixer:build']
            },
            jade: {
                files: [ '<%= project.jade_dir %>*.jade'],
                tasks: ['jade:build']
            },
            js: {
                files: '<%= concat.build.src %>',
                tasks: ['concat:build']
            }
        }

    });



    // Load the plugins
    // ===================================
    require('load-grunt-tasks')(grunt, { scope: 'devDependencies' });
    require('time-grunt')(grunt);



    // Default task(s)
    // ===================================
    grunt.registerTask('default', ['deploy', 'watch']);
    // ----------------------------------------
    grunt.registerTask('build', function() {
        grunt.task.run([
            'sass:build',       // build css
            'autoprefixer:build',
            'concat:build',     // build js
            'jade:build',       // build html
        ]);
    });

    grunt.registerTask('deploy', function() {
        // minify everything
        grunt.task.run([
            'build',
            'csscomb:build',
            'csslint:build',
            'cssmin:build',
            'uglify:build',
            'usebanner'
        ]);
    });

};
