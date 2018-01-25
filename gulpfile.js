/****

Gulpfile.js

This is what our taskrunner will read and run.

****/

// include gulp requirements
var gulp    = require('gulp'),
    gutil   = require('gulp-util'),
    uglify  = require('gulp-uglify'),
    concat  = require('gulp-concat'),
    connect = require('gulp-connect'),
    dest    = require('gulp-dest'),
    run     = require('gulp-run');

// create the task
gulp.task('dailies', function() {
  
  // setup js sources and folder to run
  var jsSources = ['config.js', 'dailies-to-slack.js'],
    outputDir = 'dist';

  // begin logging
  gutil.log( gutil.colors.magenta.bold('== Running Dailies to Slack ==') );
  // grab sources and run uglify
  // minify and add to folder
  gutil.log('Concatinating files...');
  gulp.src( jsSources )
  .pipe( uglify() )
  .pipe( concat('script.js') )
  .pipe( gulp.dest( outputDir ) )
  .pipe( connect.reload() );
  gutil.log('Files successfully merged and minified.');
  // run the new file
  gutil.log('Loading file...');
  run('node dist/script.js').exec();
  // output completion message
  gutil.log( gutil.colors.green.bold('Ready. Running file now.') );
});

// set it as the default
gulp.task('default', ['dailies']);