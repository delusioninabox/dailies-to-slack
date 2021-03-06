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
gulp.task('dailies', function(done) {
  
  // setup js sources and folder to run
  var jsSources = ['config.js', 'dailies-to-slack.js'],
    outputDir = 'dist';

  // begin logging
  gutil.log( gutil.colors.magenta.bold('== Running Dailies to Slack ==') );
  // grab sources and run uglify
  // minify and add to folder
  gutil.log('Concatinating files...');
  gulp.src( jsSources )
    .pipe( uglify().on('error', gutil.log) )
    .pipe( concat('script.js') )
    .pipe( gulp.dest( outputDir ) )
    .pipe( connect.reload() )
    .on( 'end', function() {
      run('node dist/script.js')
        .exec()
        .on('error', gutil.log)
        .on('finish', function() {
          run('rm dist/*').exec();
        });
    });
  gutil.log('Files successfully merged and minified.');
  // run the new file
  gutil.log('Loading file...')
  // output completion message
  gutil.log( gutil.colors.green.bold('Ready. Running file now.') );
  done();
});