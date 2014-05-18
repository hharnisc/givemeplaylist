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

tweetCouldNotFindArtist = function(username) {
	tweetToUser(username, 'Sorry we couldn\'t find that artist');
};

tweetPlaylistToUser = function(username, artist, url) {
	var message = 'here\'s your playlist for ' + artist + ' ' + url;
	tweetToUser(username, message);
};

tweetToUser = function(username, message) {
	twit.post('statuses/update', { status: '.@' + username + ' ' + message }, function(err, reply) {
		if (!!err) {
			console.error(err);
		}
		console.log("tweet sent to " + username);
	});
};