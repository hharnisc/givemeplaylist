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
		// getUserSentiment(request.username, function(err, score) {
		// 	if(!!err) {
		// 		console.error(err);
		// 	}
		// 	console.log(score);
		// });
		// getCurrentWeatherAtLocation(request.location.lat, request.location.lon, function(err, weather) {
		// 	if(!!err) {
		// 		console.error(err);
		// 	}
		// 	console.log(weather);
		// })
		getArtistId(request.artist, function(err, artist) {
			if(!!err) {
				console.error(err);
				return;
			}
			getRelatedArtistIds(artist, function(err, artists) {
				if(!!err) {
					console.error(err);
					return;
				}
				
				var artistList = artists;
				artistList.push(artist);
				getPlaylist(artistList, 10, 0.1, function(err, songs) {
					if(!!err) {
						console.error(err);
						return;
					}
					console.log(songs);
				});
			});	
		});
	});
}, 3000);