module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            build: {
                src: 'js/app.js', // input
                dest: 'js/build/app.min.js' // output
            }
        },

        sass: {
            dist: {                            // Target
                files: [{
                    expand: true,
                    cwd: 'css',
                    src: ['*.scss'],
                    dest: 'css/build',
                    ext: '.css'
                }]
            }
        },
        // watch for sccs files and complie to css
        watch: {
            sass: {
                files: ['css/*.scss'],
                tasks: ['sass']
            }
        }
//        // reload page after the scss file had been compiled
//        livereload: {
//            // Here we watch the files the sass task will compile to
//            // These files are sent to the live reload server after sass compiles to them
//            options: { livereload: true },
//            files: ['css/build/*', 'js/build/*']
//        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // load sass
    grunt.loadNpmTasks('grunt-contrib-sass');

    // watch
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task(s).
    grunt.registerTask('default', ['uglify', 'sass']);



};
