/****

Dailies To Slack -- function

This file contains the function our gulpfile will actually read and run.

****/
console.log("Reading variables...");

// Check necessary config variables have set values
if (webhookURL.length === 0 || feedURL.length === 0) {
  console.log("Please check your config.js file for missing data.");
} else {
  console.log("Config approved.");
}

// load npm feedparser
var request    = require("request"),
    FeedParser = require("feedparser");

// function to get feed and callback data
function getFeed(urlfeed, callback) {
  var req         = request(urlfeed), // request the URL
      feedparser  = new FeedParser(), // new feedparser object
      feedItems   = new Array();      // new array for feed items
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
    // let's find the channel ID
    request.get(
      'https://slack.com/api/channels.list',
      { json: {
        token: yourSlackToken,
      }},
      function (error, response, body) {
          if (!error) {
            console.log("response: " + body);
          }
      }
    );
    // let's get the latest posts from slack to prevent duplication
    // channels.history
    request.get(
      'https://slack.com/api/channels.history',
      { json: {
        token: yourSlackToken,
        channel: '',
      }},
      function (error, response, body) {
          if (!error) {
            console.log("response: " + body);
          }
      }
    );
    
    // print total
    var totalLength = feedItems.length,
        postCount = 0;
    console.log(totalLength + " items were found in the feed.");
    // loop through each item in the feed
    for (var i = 0; i < feedItems.length; i++) {
      // Is a category set in config.js?
      if (category !== '') {
        // if so, get categories
        var feedCats = feedItems[i].categories;
        // and only print those that match
        if (feedCats.indexOf(category) > -1) {
          //postToSlack( feedItems[i] );
          postCount++;
        }
      } else {
        // If no category set in config.js
        // Then print all items
        //postToSlack( feedItems[i] );
        postCount++;
      }
      // if a post limit is set
      if (postLimit > 0) {
        // check if the number of posts created has reached the postLimit
        if (postCount == postLimit) {
          // if so, break the loop
          i = totalLength;
          console.log("Post limit reached, breaking queue.");
        }
      }

    }
  } // end if no errrors
});

function postToSlack(feedItem) {
  // feedparser docs: https://www.npmjs.com/package/feedparser
  var title   = feedItem.title,       // item title
      desc    = feedItem.description, // item description
      pubDate = feedItem.pubdate,     // item published date
      link    = feedItem.link,        // site link
      image   = feedItem.image;       // item image object with ["title"] and ["url"] properties

  var message = ''; // if you want a message before the slack attachment, put it here

  if( !image.length ) {
    // no image found? let's look in the description
    var rex = /<img[^>]+src="?([^"\s]+)"?\s*\/>/g;
    var imageUrl = rex.exec( desc );
    image = imageUrl[1];
    console.log('No image, checked description.');
  } else {
    image = image['url'];
  }
  
  request.post(
      webhookURL,
      { json: { text: message, attachments: [ 
                {
                    author_name : '',
                    color       : '#008080',
                    title       : title,
                    title_link  : link,
                    image_url   : image,
                    footer      : 'Dailies To Slack | ' + pubDate,
                    footer_icon : 'http://78.media.tumblr.com/avatar_6f945e8452bd_128.pnj'
                }
              ] }
      },
      function (error, response, body) {
          if (!error) {
            console.log("Posted " + title);
          }
      }
  );
}

//curl -X POST -H 'Content-type: application/json' --data '{"text":"Hello, World!"}' https://hooks.slack.com/services/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