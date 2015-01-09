var gulp = require('gulp'),
	uglify = require('gulp-uglify'),
	concat = require('gulp-concat'),
	compass = require('gulp-compass'),
	sass = require('gulp-ruby-sass'),
	minifyCSS = require('gulp-minify-css'),
	plumber = require('gulp-plumber'),
	livereload = require('gulp-livereload'),
	prefix = require('gulp-autoprefixer'),
	imagemin = require('gulp-imagemin');
// var pngquant = require('imagemin-pngquant');




// Scripts Tasks
// Uglifies
gulp.task('scripts', function() {
	gulp.src(['app/js/jquery.js',
		// 'app/js/history.js',
		// 'app/js/jquerymobilecustom.js',
		// 'app/js/hammer.js',
		// 'app/js/fastclick.js',
		'app/velocity.js',
		'app/js/base.js'])
		.pipe(plumber())
		.pipe(concat('app.js'))
		// .pipe(uglify('app.js',{
		// 	outSourceMap: true
		// }))
		.pipe(gulp.dest('app/js'))
		.pipe(livereload());
});

// Styles Task
// Coverts to SCSS
gulp.task('styles', function() {
	gulp.src('app/css/scss/*.scss')
		.pipe(plumber())
		.pipe(compass({
			css: 'app/css',
			sass: 'app/css/scss',
			// image: 'app/images',
		}))
		.on('error', function(err){
			console.log("error", err);
		})
		.pipe(prefix('Chrome', 'Firefox', 'ios 7', 'Safari'))
		.pipe(gulp.dest('app/css'))
		.pipe(livereload());
});

// Watch Task
// Watches JS
gulp.task('watch', function(){
	var server = livereload();

	gulp.watch('app/js/*.js', ['scripts']);
	gulp.watch('app/css/scss/partials/*.scss', ['styles'])
});

gulp.task('build',function(){

	//minify app.css and place in dist folder
	gulp.src('app/css/app.css')
		.pipe(minifyCSS())
		.on('error', function(err){
			console.log("error", err);
		})
		.pipe(gulp.dest('dist/css'));

	//minify and ugly app.js and place in dist folder
	gulp.src('app/js/app.js')
		.pipe(uglify())
		.on('error', function(err){
			console.log("error", err);
		})		
		.pipe(gulp.dest('dist/js'));

	//move php into dist
	gulp.src('app/*.php')
		.pipe(gulp.dest('dist'));

	//move php partials into dist
	gulp.src('app/include/*.php')
		.pipe(gulp.dest('dist/include'));

	//move fonts into dist
	gulp.src('app/css/fonts/*')
		.pipe(gulp.dest('dist/css/fonts'));

	//move images into dist
	gulp.src('app/imgs/**/*.{png,jpg,jpeg,gif}')
		.pipe(imagemin({
			progressive: true
			// optimizationLevel: 7,

		}))
		.pipe(gulp.dest('dist/imgs'));

});

gulp.task('default', ['scripts', 'styles', 'watch']);