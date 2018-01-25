/****

Dailies To Slack -- function

This file contains the function our gulpfile will actually read and run.

****/
console.log("Reading variables...");

if (channel.length === 0 || feedURL.length === 0) {
  console.log("Please check your config.js file for missing data.");
} else {
  console.log("Variables found!");
}