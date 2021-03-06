const gulp         = require('gulp');
const babel        = require('gulp-babel');
const minify       = require('gulp-minify');
const cleanCSS     = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const rename       = require("gulp-rename");
const htmlmin      = require('gulp-htmlmin');
const replace      = require('gulp-replace');
const ghPages      = require('gulp-gh-pages');

gulp.task('default', ['watch']);

gulp.task('minifyJS', function() {
  return gulp.src('../source/main.js').pipe(babel({presets: ['../build/node_modules/babel-preset-es2015']})).pipe(minify({ext:{min: '.min.js'}, noSource: true}))/*.pipe(rename("main.min.js"))*/.pipe(gulp.dest('../dist'));
});

gulp.task('minifyCSS', function() {
  return gulp.src('../source/main.css').pipe(autoprefixer({browsers: ['last 2 versions'],cascade: false})).pipe(cleanCSS()).pipe(rename("main.min.css")).pipe(gulp.dest('../dist'));
});

gulp.task('minifyHTML', function() {
  return gulp.src('../source/index.html').pipe(replace('main.css', 'main.min.css')).pipe(replace('main.js', 'main.min.js')).pipe(htmlmin({collapseWhitespace: true})).pipe(gulp.dest('../dist'));
});

gulp.task('copyTexture', function() {
  return gulp.src('../source/texture.png').pipe(gulp.dest('../dist'));
});

gulp.task('deploy', function() {
  gulp.src('../CNAME').pipe(gulp.dest('../dist'));
  return gulp.src('../dist/*').pipe(ghPages());
});

gulp.task('watch', function() {
  gulp.watch('../source/main.js', ['minifyJS']);
  gulp.watch('../source/main.css', ['minifyCSS']);
  gulp.watch('../source/index.html', ['minifyHTML', 'copyTexture']);
});
