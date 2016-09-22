var gulp  = require('gulp');
const babel = require('gulp-babel');
var minify = require('gulp-minify');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var htmlmin = require('gulp-htmlmin');
var replace = require('gulp-replace');

gulp.task('default', ['watch']);

gulp.task('minifyJS', function() {
  return gulp.src('../source/main.js').pipe(babel({presets: ['./build/node_modules/babel-preset-es2015']})).pipe(minify({ext:{min: '.min.js'}, noSource: true}))/*.pipe(rename("main.min.js"))*/.pipe(gulp.dest('../dist'));
});

gulp.task('minifyCSS', function() {
  return gulp.src('../source/main.css').pipe(cleanCSS()).pipe(rename("main.min.css")).pipe(gulp.dest('../dist'));
});

gulp.task('minifyHTML', function() {
  return gulp.src('../source/index.html').pipe(replace('main.css', 'main.min.css')).pipe(replace('main.js', 'main.min.js')).pipe(htmlmin({collapseWhitespace: true})).pipe(gulp.dest('../dist'));
});

gulp.task('watch', function() {
  gulp.watch('../source/main.js', ['minifyJS']);
  gulp.watch('../source/main.css', ['minifyCSS']);
  gulp.watch('../source/index.html', ['minifyHTML']);
});
