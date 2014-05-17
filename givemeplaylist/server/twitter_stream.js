twit = new TwitMaker({
	consumer_key: Meteor.settings.twitterApiKey,
	consumer_secret: Meteor.settings.twitterApiSecret,
	access_token: Meteor.settings.twitterAccessToken,
	access_token_secret: Meteor.settings.twitterAccessSecret
});

Meteor.startup(function () {

});

Meteor.setInterval(function() {
	// TODO: use a collection observer
	var pendingRequests = PlaylistRequest.find({processed: false});
	pendingRequests.forEach(function(request) { 
		getUserSentiment(request.username, function(err, score) {
			if(!!err) {
				console.error(err);
			}
			console.log(score);
		});
		getCurrentWeatherAtLocation(request.location.lat, request.location.lon, function(err, weather) {
			if(!!err) {
				console.error(err);
			}
			console.log(weather);
		})
	});
}, 10000);