# dailies-to-slack
Checks RSS feed for new daily comics, then posts to Slack Web API.

### Setup Your App and Config
First you'll want to make a copy of the `config-sample.js` file. Rename it to just `config.js`. Go ahead and open this file -- we're going to add our variables as we go.

Now we'll need to add a new Slack App to your workspace. You can do this at `https://api.slack.com/apps` by clicking the green `Create a New App` button. Give it a name and choose the workspace to add it to.

Under `Add Features and Functionality`, you'll first want to an `incoming webhook`. To add, simply select the channel you want your updates to go to and then hit `authorize`. Copy and paste the URL it gives you and add this into your `config.js` file for the variable `webhookURL`. Additionally, let's put the name of the channel we chose in the variable `channel`. You don't need the `#` symbol, only the name.

Perfect! Now let's create a bot. Again under `add features and functionality` you'll find a section for `bots`. All you need is to give it a display name and username. You can give these any name you like, but not that the username _must_ be unique and cannot be the same as the channel name or another user.

Cool. If you go to the `oAuth and Permissions` tab now, you should find two tokens: `OAuth Access Token` and `Bot User OAuth Access token`. Let's copy and paste both of these into `config.js`, for the variables `youroAuthToken` and `yourSlackToken`, respectfully.

Almost there! Scroll down on the `oAuth and Permissions` page and you'll find a section to select permissions scope. Your bot and incoming webhook should already be listed. We're going to add one more -- search in the `Add permission by scope...` dropdown for `channels:history` and add it.

Nice! We're done with Slack. Let's finish our config file.

In the variable `feedURL`, set it to the URL to the RSS feed you want to read from. If this feed pulls a variety of items and you only want to pull those with a certain category or tag identifier, you'll save that category name in the `category` variable.

There's two variables left, both which are optional. `postLimit` will limit the number of posts it will make to the Slack channel.  The `rssLimit` on the other hand limits the number of new RSS items to look through to post. If no limit is set, it will go through the _enitre_ RSS feed until it finds new items to post. But setting the limit to 5 for example will only see if the newest 5 items have been posted.

### Running
Once your configuration is complete, go to your directory in your terminal and run `gulp dailies`. It will run the task to compile the code and perform it's task to post. And that's it!

### Security Note
Do not **ever** post your slack oauth tokens online. The `.gitignore` specifically ignores the `config.js` and `dist` directory for this reason, and the gulp task should delete the minified file after running. If you accidentally do post these online, you can reinstall your slack API to generate new access keys -- but be sure to also delete the old ones from the `oAuth and Permissions` page!