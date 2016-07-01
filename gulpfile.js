var src = [
		'js/lib/jquery.js',
		'js/lib/underscore.js',
		'js/lib/backbone.js',
		'js/lib/jquery-mobile.js',
		'js/modules/actions/baseAction.js',
		'js/ui-views/panels/panelView.js',
		'js/ui-views/controls/controlView.js',
		'js/modules/*.js',
		'js/*.js',
		'js/*/*.js',
		'js/*/*.js',
		'js/*/*/*.js'
	],
	path = ['js/*.js', 'js/*/*.js', 'js/*/*.js', 'js/*/*/*.js'],
	gulp = require('gulp'),
	minify = require('gulp-minify'),
	concat = require('gulp-concat'),
	del = require('del'),
	combiner = require('stream-combiner2'),
	runSeq = require('run-sequence');

gulp.task('clean', function() {
	return del(['src']);
});

gulp.task('serve', function () {
	var liveServer = require("live-server"),
		path = require('path');

	var params = {
		port: 8100,
		root: "",
		ignore: [
			'src/app-min.js',
			'src/app.js'
		],
		logLevel: 0
	};

	params.ignore = params.ignore.map(function(relativePath) {
		return path.join(params.root, relativePath);
	});

	return liveServer.start(params);
});

gulp.task('build-js', function() {

	var combined = combiner.obj([
		gulp.src(src),
		concat("app.js"),
		gulp.dest('src')
	]);

	combined.on('error', console.error.bind(console));

	return combined;
});

gulp.task('watch', function() {
	gulp.watch(path, ['build-js']);
});

gulp.task('run', function () {
	runSeq(['clean', 'build-js', 'watch', 'serve']);
});

