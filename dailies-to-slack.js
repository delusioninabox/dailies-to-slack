/****

Dailies To Slack -- function

This file contains the function our gulpfile will actually read and run.

****/
console.log("Reading variables...");

// Check necessary config variables have set values
if (webhookURL.length === 0 || feedURL.length === 0 || yourSlackToken.length === 0 || channel.length === 0 ) {
  console.log("Please check your config.js file for missing data.");
} else {
  console.log("Config approved.");
}

// load npm feedparser
var request     = require("request"),
    FeedParser  = require("feedparser"),
    slackAPI    = 'https://slack.com/api/';

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
    var pass = 0;
    // let's find the channel ID
    // channels.list
    request.get(
      slackAPI + 'channels.list?exclude_archived=true&exclude_members=true&token=' + yourSlackToken,
      function (error, response, body) {
          if (!error) {
            var channelConf   = false,
                parseResponse = JSON.parse(body),
                channelList   = parseResponse.channels,
                channelID     = '';
              // find match in 'name' and return 'id'
              for (var x = 0; x < channelList.length; x++) {
                //console.log( channelList[x]['name']);
                if (channelList[x]['name'].indexOf( channel ) > -1 || channelList[x]['id'].indexOf( channel ) > -1 ) {
                  //postToSlack( feedItems[i] );
                  channelConf = true;
                  channelID   = channelList[x]['id'];
                }
              }
            if( channelConf == true ) {
              console.log("Channel has been confirmed as valid.");
              channel = channelID;
              pass++;
            } else {
              console.log("Channel was not found.");
            }
          }
          // let's get the latest posts from the slack channel to prevent duplication
          // channels.history
          request.get(
            slackAPI + 'channels.history?token=' + youroAuthToken + '&channel=' + channel + '&count=30',
            function (error, response, body) {
                console.log('Checking history of ' + channel);
                if (!error) {
                  var parseResponse = JSON.parse(body),
                      messages      = parseResponse.messages;
                }
                if( messages.length > 0 ) {
                  pass++;
                  console.log("Channel history retrieved.");
                } else {
                  console.log("No messages found in this channel.");
                }

                if( pass == 2 ) {
                  console.log("Preparing to post...");
                  okToPostToSlack( messages );
                } else {
                  console.log("Posting aborted because of errors found.");
                }
            }
          );
        } // end check history request
    ); // end check channels request

    // function to post valid items to Slack
    // messages is array of channel history
    // messages is used to check and prevent duplication
    function okToPostToSlack( messages ) {
      // print total
      var totalLength = feedItems.length,
          postCount = 0;
      console.log(totalLength + " items were found in the feed.");
      // If the limit of rss items to check is less than the length
      // we'll set the length to the rss item limit
      if( rssLimit > 0 && rssLimit < totalLength ) {
        console.log("Only checking latest " + rssLimit + " items.");
        totalLength = rssLimit;
      }
      // loop through each item in the feed
      //for (var i = 0; i < totalLength; i++) {
      for (var i = totalLength; i >= 0; i--) {

        // we'll identify posts by the attachment titles, which should be unique
        var titleId = 'Dailies to Slack | ' + feedItems[i]['pubDate'];
        // only pursue posting if not found in message history
        if ( checkExists( messages, titleId ) === false ) {

          // Is a category set in config.js?
          if (category !== '') {
            // if so, get categories
            var feedCats = feedItems[i].categories;
            // and only print those that match
            if (feedCats.indexOf(category) > -1) {
              postToSlack( feedItems[i] );
              postCount++;
            }

          } else {
            // If no category set in config.js
            // Then print all items
            postToSlack( feedItems[i] );
            postCount++;
          }
        } else {
          console.log("Post " + feedItems[i]['title'] + " already posted.");
        } // end not in message history

        // if a post limit is set
        if (postLimit > 0) {
          // check if the number of posts created has reached the postLimit
          if (postCount == postLimit) {
            // if so, break the loop
            i = 0;
            console.log("Posts queued.");
          }
        }

      } // end for loop
    } // end okToPostToSlack function

  } // end if no errrors
});

// function to post the feed items to Slack
// feedItem is object of rss item data
function postToSlack(feedItem) {
  // get all the feed values
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
    console.log('No image, searching description.');
  } else {
    // image found, so we grab that URL from the meta
    image = image['url'];
  }

  // post to slack channel in appropiate format
  // uses generate webhook URL from Slack
  request.post(
      webhookURL,
      { json: { text: message, attachments: [
                {
                    author_name : '',
                    color       : '#ff2885',
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
  ); // end post
} // end function postToSlack

// function to check message history for item
// localMessages is array of channel message history
// titleToFind is a string to search for as unique identifier
// we are using the attachment footer as that unique identifier
function checkExists(localMessages, titleToFind) {
    for (var i = 0; i < localMessages.length; ++i) {
      var attachments = localMessages[i]['attachments'];
      // only check items that have attachments
      if( attachments ) {
        var attachmentTitle = attachments['0']['footer'];
        if ( attachmentTitle.toString().toLowerCase() === titleToFind.toString().toLowerCase() ) {
            return true;
            // return true if title found
        }
      }
    }
  return false;
  // return false if title not found
} // end function checkExists