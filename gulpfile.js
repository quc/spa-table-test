var gulp = require('gulp');
var less = require('gulp-less');
var connect = require('gulp-connect');
var autoprefixer = require('gulp-autoprefixer');


var paths = {
  less: 'less/*.less',
  css: 'css',
  js: 'js/*.js',
  html : '*.html'
};

gulp.task('default', ['watch', 'js', 'less', 'connect']);

gulp.task('watch', function() {
    gulp.watch(paths.less, ['less']);
    gulp.watch(paths.js, ['js']);
    gulp.watch(paths.html, ['html']);
});

gulp.task('less', function () {
  return gulp.src(paths.less)
    .pipe(less({
      paths: [paths.less]
    }))
    .pipe(autoprefixer({
      browsers: ['> 5%', 'IE 9']
    }))
    .pipe(gulp.dest(paths.css))
    .pipe(connect.reload());
});

gulp.task('html', function() {
  return gulp.src(paths.html)
        .pipe(connect.reload());
});

gulp.task('js', function() {
  return gulp.src(paths.js)
        .pipe(connect.reload());
});

gulp.task('connect', function() {
  return connect.server({
    port: 1337,
    livereload: true,
    root: './'
  });
});
