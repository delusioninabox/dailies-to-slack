/****

Dailies To Slack -- function

This file contains the function our gulpfile will actually read and run.

****/
console.log("Reading variables...");

// Check necessary config variables have set values
if (channel.length === 0 || feedURL.length === 0) {
  console.log("Please check your config.js file for missing data.");
} else {
  console.log("Config approved.");
}

// load npm feedparser
var request    = require("request"),
    FeedParser = require("feedparser");

// function to get feed and callback data
function getFeed(urlfeed, callback) {
  var req         = request(urlfeed),   // request the URL
      feedparser  = new FeedParser(),   // new feedparser object
      feedItems   = new Array();        // new array for feed items
  req.on("response", function (response) {
    // if request response is good, continue to run feedparser
    var stream = this;
    if (response.statusCode == 200) {
      stream.pipe(feedparser);
    }
  });
  req.on("error", function (err) {
    // if request responds with error, print the error
    console.log("getFeed: err.message == " + err.message);
  });
  feedparser.on("readable", function () {
    // if continue, try to read the feed
    try {
      // is readable
      var item = this.read(),
        flnew;
      if (item !== null) {
        // push valid items into array
        feedItems.push(item);
      }
    } catch (err) {
      // is not readable
      // invalid feed
      console.log("getFeed: err.message == " + err.message);
    }
  });
  // when feedparser ends, print callback
  feedparser.on("end", function () {
    callback(undefined, feedItems);
  });
  // if feedparser error, print it
  feedparser.on("error", function (err) {
    console.log("getFeed: err.message == " + err.message);
    callback(err);
  });
}

// call getFeed function and define the callback (success) function
getFeed(feedURL, function (err, feedItems) {
  // only run if no errors
  if (!err) {
    // print total
    console.log( feedItems.length + " items were found in the feed.\n");
    // loop through each item in the feed
    for (var i = 0; i < feedItems.length; i++) {
      // Is a category set in config.js?
      if( category !== '' ) {
        // if so, get categories
        var feedCat = feedItems[i].categories;
        // and only print those that match
        if ( feedCat.indexOf( category ) > -1 ) {
          console.log( feedItems[i].title + " " + feedItems[i].link + ".\n");
        }
      } else {
        // If no category set in config.js
        // Then print all items
        console.log( feedItems[i].title + " " + feedItems[i].link + ".\n");
      }
    }
  } // end if no errrors
});
