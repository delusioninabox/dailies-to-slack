var feedURL="http://delusioninabox.tumblr.com/rss",channel="daily-comics",category="daily",postLimit=1,webhookURL="https://hooks.slack.com/services/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",yourSlackToken="xoxb-306133494614-VZXOIqT0L5k05mkeiv9OnJvj",youroAuthToken="xoxp-2156595928-255005948962-304290866768-b23e548e8ba08309636239a69929bcc7";
console.log("Reading variables..."),0===webhookURL.length||0===feedURL.length||0===yourSlackToken.length||0===channel.length?console.log("Please check your config.js file for missing data."):console.log("Config approved.");var request=require("request"),FeedParser=require("feedparser"),slackAPI="https://slack.com/api/";function getFeed(e,o){var n=request(e),s=new FeedParser,t=new Array;n.on("response",function(e){200==e.statusCode&&this.pipe(s)}),n.on("error",function(e){console.log("getFeed: err.message == "+e.message)}),s.on("readable",function(){try{var e=this.read();null!==e&&t.push(e)}catch(e){console.log("getFeed: err.message == "+e.message)}}),s.on("end",function(){o(void 0,t)}),s.on("error",function(e){console.log("getFeed: err.message == "+e.message),o(e)})}function postToSlack(e){var o=e.title,n=e.description,s=e.pubdate,t=e.link,l=e.image;if(l.length)l=l.url;else{l=/<img[^>]+src="?([^"\s]+)"?\s*\/>/g.exec(n)[1],console.log("No image, checked description.")}request.post(webhookURL,{json:{text:"",attachments:[{author_name:"",color:"#008080",title:o,title_link:t,image_url:l,footer:"Dailies To Slack | "+s,footer_icon:"http://78.media.tumblr.com/avatar_6f945e8452bd_128.pnj"}]}},function(e,n,s){e||console.log("Posted "+o)})}function checkExists(e,o){for(var n=[],s=0;s<e.length;++s){var t=e[s].attachments;if(t){var l=t[0].footer;n.push(l),console.log("checking message "+s)}}return console.log(n),n.indexOf(o)>-1?(console.log("match found"),!0):(console.log("no match"),!1)}getFeed(feedURL,function(e,o){if(!e){var n=0;request.get(slackAPI+"channels.list?exclude_archived=true&exclude_members=true&token="+yourSlackToken,function(e,s,t){if(!e){for(var l=!1,a=JSON.parse(t).channels,r="",c=0;c<a.length;c++)(a[c].name.indexOf(channel)>-1||a[c].id.indexOf(channel)>-1)&&(l=!0,r=a[c].id);1==l?(console.log("Channel has been confirmed as valid."),channel=r,n++):console.log("Channel was not found.")}request.get(slackAPI+"channels.history?token="+youroAuthToken+"&channel="+channel+"&count=10",function(e,s,t){if(console.log("Checking history of "+channel),!e)var l=JSON.parse(t).messages;l.length>0?(n++,console.log("Channel history retrieved.")):console.log("No messages found in this channel."),2==n?(console.log("Preparing to post..."),function(e){var n=o.length,s=0;console.log(n+" items were found in the feed.");for(var t=0;t<o.length;t++){var l="Dailies to Slack | "+o[t].pubDate;if(!1===checkExists(e,l))if(""!==category){var a=o[t].categories;a.indexOf(category)>-1&&s++}else s++;else console.log("Post "+o[t].title+" already posted.");postLimit>0&&s==postLimit&&(t=n,console.log("Posts queued."))}}(l)):console.log("Posting aborted because of errors found.")})})}});