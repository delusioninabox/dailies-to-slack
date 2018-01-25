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

var request = require("request");
var FeedParser = require("feedparser");

function getFeed(urlfeed, callback) {
  var req = request(urlfeed);
  var feedparser = new FeedParser();
  var feedItems = new Array();
  req.on("response", function (response) {
    var stream = this;
    if (response.statusCode == 200) {
      stream.pipe(feedparser);
    }
  });
  req.on("error", function (err) {
    console.log("getFeed: err.message == " + err.message);
  });
  feedparser.on("readable", function () {
    try {
      var item = this.read(),
        flnew;
      if (item !== null) { //2/9/17 by DW
        feedItems.push(item);
      }
    } catch (err) {
      console.log("getFeed: err.message == " + err.message);
    }
  });
  feedparser.on("end", function () {
    callback(undefined, feedItems);
  });
  feedparser.on("error", function (err) {
    console.log("getFeed: err.message == " + err.message);
    callback(err);
  });
}

getFeed(feedURL, function (err, feedItems) {
  if (!err) {
    function pad(num) {
      var s = num.toString(),
        ctplaces = 3;
      while (s.length < ctplaces) {
        s = "0" + s;
      }
      return (s);
    }
    console.log("There are " + feedItems.length + " items in the feed.\n");
    for (var i = 0; i < feedItems.length; i++) {
      console.log("Item #" + pad(i) + ": " + feedItems[i].description + " " + feedItems[i].link + ".\n");
    }
  }
});
