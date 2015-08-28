module.exports = function(grunt) {

	grunt.initConfig({

		connect: {
			server: {
				options: {
					port: 9001,
					base: 'www',
					open: true
				}
			}
		},

		sass: {
			options: {
				sourceMap: false,
				outputStyle: 'expanded'
			},
			dist: {
				files: {
				    'www/style.css': 'scss/build.scss'
				}
			}
		}, 

		watch: {
	        css: {
                files: ['scss/*.scss'],
                tasks: ['sass'],
                options: {
                    spawn: false
                }
            }
		}

	});

	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-autoprefixer');

	grunt.registerTask('default', ['connect:server','watch']);
};