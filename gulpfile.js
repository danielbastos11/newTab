'use strict';

var gulp    = require('gulp'),
    stylus  = require('gulp-stylus'),
    concat  = require('gulp-concat'),
    rollup  = require('rollup-stream'),
    source  = require('vinyl-source-stream'),
    babel   = require('gulp-babel');

gulp.task('default', ['assets', 'css', 'html', 'js']);

gulp.task('watch', () => {
  gulp.watch('./source/**/*.html', ['html']);
  gulp.watch('./source/**/*.{jsx,js}', ['js']);
  gulp.watch('./source/**/*.styl', ['css']);
});

gulp.task('assets', () => {
  return gulp
  .src('./assets/**/*.*')
  .pipe(gulp.dest('dist'));
});

gulp.task('html', () => {
  return gulp
  .src('./source/*.html')
  .pipe(gulp.dest('dist'));
});

gulp.task('js', () => {
  return rollup('rollup.config.js')
  .pipe(source('app.js'))
  .pipe(gulp.dest('dist'));
});

gulp.task('css', () => {
  return gulp
        .src('./source/**/*.styl')
        .pipe(stylus())
        .pipe(concat('style.css'))
        .pipe(gulp.dest('dist'));
});
