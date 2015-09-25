###
# @desc
# The Gruntfile to automate all the tasks on client-side.
#
# @author Navdeep
###

module.exports = ( grunt ) ->

	# Load all the plugins:
	grunt.loadNpmTasks "grunt-browserify"
	grunt.loadNpmTasks "grunt-contrib-watch"

	# Config storing directory paths:
	dirConfig =
		scripts:
			src: "client"
			dest: "public/js"

	# Intialize the tasks to perform accordingly:
	grunt.initConfig

		# Store the `package.json` file in a nifty variable:
		pkg: grunt.file.readJSON "package.json"

		# Get the directory config inside this closure:
		dir: dirConfig

		# Browserify @task
		browserify:
			options:
				transform: [ "babelify" ]
				browserifyOptions:
					extensions: [ ".jsx" ]
			watchify:
				options:
					watch: true
				files: "<%= browserify.scripts.files %>"
			scripts:
				files: [
					expand: true
					cwd: "<%= dir.scripts.src %>/"
					src: [ "*.js", "*.jsx" ]
					dest: "<%= dir.scripts.dest %>/"
					ext: ".bundle.js"
				]

		# Watch @task
		watch:
			files: "public/css/*.css"
			tasks: ""

	# Register tasks:
	grunt.registerTask "default", "The default task", [
		"dev"
	]

	grunt.registerTask "watchify", "Watchifying scripts and watching other assets", [
		"browserify:watchify"
		"watch"
	]

	grunt.registerTask "dev", "Cooks up the front end assets for development", [
		"browserify:scripts"
	]