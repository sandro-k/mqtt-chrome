module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        sass: {
            dist: { // Target
                files: [{
                    expand: true,
                    src: ['*.scss'],
                    dest: 'build/css',
                    ext: '.css'
                }]
            }
        },
        // watch for sccs files and compile to css
        watch: {
            sass: {
                files: ['*.scss'],
                tasks: ['sass']
            }
        }
    });


    // load sass
    grunt.loadNpmTasks('grunt-contrib-sass');

    // watch
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task(s).
    grunt.registerTask('default', ['sass']);

};
