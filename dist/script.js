var feedURL="http://delusioninabox.tumblr.com/rss",category="daily",postLimit=1,webhookURL="https://hooks.slack.com/services/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",yourSlackToken="xoxp-2156595928-255005948962-304290866768-b23e548e8ba08309636239a69929bcc7";
console.log("Reading variables..."),0===webhookURL.length||0===feedURL.length?console.log("Please check your config.js file for missing data."):console.log("Config approved.");var request=require("request"),FeedParser=require("feedparser");function getFeed(e,o){var n=request(e),t=new FeedParser,s=new Array;n.on("response",function(e){200==e.statusCode&&this.pipe(t)}),n.on("error",function(e){console.log("getFeed: err.message == "+e.message)}),t.on("readable",function(){try{var e=this.read();null!==e&&s.push(e)}catch(e){console.log("getFeed: err.message == "+e.message)}}),t.on("end",function(){o(void 0,s)}),t.on("error",function(e){console.log("getFeed: err.message == "+e.message),o(e)})}function postToSlack(e){var o=e.title,n=e.description,t=e.pubdate,s=e.link,r=e.image;if(r.length)r=r.url;else{r=/<img[^>]+src="?([^"\s]+)"?\s*\/>/g.exec(n)[1],console.log("No image, checked description.")}request.post(webhookURL,{json:{text:"",attachments:[{author_name:"",color:"#008080",title:o,title_link:s,image_url:r,footer:"Dailies To Slack | "+t,footer_icon:"http://78.media.tumblr.com/avatar_6f945e8452bd_128.pnj"}]}},function(e,n,t){e||console.log("Posted "+o)})}getFeed(feedURL,function(e,o){if(!e){request.get("https://slack.com/api/channels.list",{json:{token:yourSlackToken}},function(e,o,n){e||console.log("response: "+n)}),request.get("https://slack.com/api/channels.history",{json:{token:yourSlackToken,channel:""}},function(e,o,n){e||console.log("response: "+n)});var n=o.length,t=0;console.log(n+" items were found in the feed.");for(var s=0;s<o.length;s++){if(""!==category)o[s].categories.indexOf(category)>-1&&t++;else t++;postLimit>0&&t==postLimit&&(s=n,console.log("Post limit reached, breaking queue."))}}});