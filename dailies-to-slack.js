/****

Dailies To Slack -- function

This file contains the function our gulpfile will actually read and run.

****/
console.log( "Reading variables..." );

if( !channel ) {
  console.log( "Please check your config.js file for missing data." );
} else {
  console.log( "Variables found!" );
}