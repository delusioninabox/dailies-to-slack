var feedURL="http://delusioninabox.tumblr.com/rss",channel="dailies";
console.log("Reading variables..."),0===channel.length||0===feedURL.length?console.log("Please check your config.js file for missing data."):console.log("Variables found!");var request=require("request"),FeedParser=require("feedparser");function getFeed(e,n){var o=request(e),r=new FeedParser,s=new Array;o.on("response",function(e){200==e.statusCode&&this.pipe(r)}),o.on("error",function(e){console.log("getFeed: err.message == "+e.message)}),r.on("readable",function(){try{var e=this.read();null!==e&&s.push(e)}catch(e){console.log("getFeed: err.message == "+e.message)}}),r.on("end",function(){n(void 0,s)}),r.on("error",function(e){console.log("getFeed: err.message == "+e.message),n(e)})}getFeed(feedURL,function(e,n){if(!e){function o(e){for(var n=e.toString();n.length<3;)n="0"+n;return n}console.log("There are "+n.length+" items in the feed.\n");for(var r=0;r<n.length;r++)console.log("Item #"+o(r)+": "+n[r].description+" "+n[r].link+".\n")}});