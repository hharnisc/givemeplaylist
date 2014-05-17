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
