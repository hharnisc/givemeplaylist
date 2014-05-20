var Setiment = Meteor.require('sentiment');

getUserSentiment = function(username, cb) {	
	// callback return values - error, score
	twit.get('statuses/user_timeline', {'screen_name': username, 'count': 10}, function(err, data, response) {
		if(!!err) {
			cb(err, undefined);
			return;
		}
		var totalScore = 0;
		_.forEach(data, function(tweet) {
			totalScore += Setiment(tweet.text).score;
		});
		cb(undefined, totalScore);
	});
};

parseArtist = function(message) {
	return message.toLowerCase().replace('@' + Meteor.settings.twitterUsername.toLowerCase() + ' ', '');
};

removeUsernames = function(message) {
	return message.replace(/(@[A-Za-z0-9\_]+)|([^0-9A-Za-z \t])|(\w+:\/\/\S+)/, '');
}

tweetCouldNotFindArtist = function(username, inReplyToId) {
	replyToUser(username, 'Sorry we couldn\'t find that artist', inReplyToId);
};

tweetPlaylistToUser = function(username, artist, url, inReplyToId) {
	var message = 'here\'s your playlist for ' + artist + ' ' + url;
	replyToUser(username, message, inReplyToId);
};

replyToUser = function(username, message, inReplyToId) {
	twit.post('statuses/update', {
		status: '@' + username + ' ' + message,
		in_reply_to_status_id: inReplyToId
	}, function(err, reply) {
		if (!!err) {
			console.error(err);
		}
		console.log("tweet sent to " + username);
	});
};