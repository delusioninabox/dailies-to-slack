/****

Dailies To Slack -- App Settings
This is a sample configuation file. To setup:
1) Copy this file
2) Rename the copy to "config.js"
3) Replace sample setting names with correct values
4) Save, then run dailies-to-slack.js

****/

// RSS feed to read from
var feedURL     = '';

// Slack #channel to post to
var channel     = '';

// Category from feed to post
// If this feed doesn't use categories
// or if you want to post from the whole feed
// leave this string blank ( category = ''; )
var category    = '';

// limit the number of new posts to post
var postLimit   = 1;

// Webhook URL
var webhookURL  = '';

// Your Slack Token
var yourSlackToken = 'xoxb-####';

// Your oAuth Token
var youroAuthToken = 'xoxp-####';