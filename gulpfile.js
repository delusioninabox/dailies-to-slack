/****

Gulpfile.js

This is what our taskrunner will read and run.

****/

// include gulp requirements
var gulp    = require('gulp'),
    gutil   = require('gulp-util'),
    exec    = require('gulp-exec'),
    uglify  = require('gulp-uglify'),
    concat  = require('gulp-concat'),
    connect = require('gulp-connect'),
    dest    = require('gulp-dest');

// create the task
gulp.task('dailies', function() {
  
  // set options for executing files
  var setOptions = {
  	err: true,     // default = true, false means don't write err
  	stderr: true,  // default = true, false means don't write stderr
  	stdout: true   // default = true, false means don't write stdout
  }
  // setup js sources and folder to run
  var jsSources = ['config.js', 'dailies-to-slack.js'],
    outputDir = 'dist';

  
  // begin logging
  gutil.log( gutil.colors.bold('== Running Dailies to Slack ==') );
  // grab sources and run uglify
  // minify and add to folder
  // run new files
  gutil.log('Concatinating files...');
  gulp.src( jsSources )
  .pipe( uglify() )
    .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
  .pipe( concat('script.js') )
  .pipe( dest( outputDir ) )
  .pipe( connect.reload() );
  gutil.log('Files successfully merged and minified.');
  gutil.log('Running output...');
  exec('node dist/script.js', setOptions)
    .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); });
  gutil.log( gutil.colors.green.bold('Success!') );
});

// set it as the default
gulp.task('default', ['dailies']);