module.exports = function(grunt) {

    grunt.initConfig({
        vulcanize: {
            default: {
                options: {
                    // Task-specific options go here.
                },
                files: {
                    'build/build.html': 'public/app/index.html'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-vulcanize');

    grunt.registerTask('default', ['build']);
    grunt.registerTask('build', ['vulcanize']);

};