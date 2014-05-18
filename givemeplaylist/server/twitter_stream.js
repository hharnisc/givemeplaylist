twit = new TwitMaker({
	consumer_key: Meteor.settings.twitterApiKey,
	consumer_secret: Meteor.settings.twitterApiSecret,
	access_token: Meteor.settings.twitterAccessToken,
	access_token_secret: Meteor.settings.twitterAccessSecret
});

Meteor.startup(function () {
	// TODO: use a collection observer
	var pendingRequests = PlaylistRequest.find({processed: false});
	pendingRequests.forEach(function(request) { 
		var sentiment, weather, artistList;
		getUserSentiment(request.username, function(err, score) {
			if(!!err) {
				console.error(err);
			}
			sentiment = score;
			generatePlaylist(sentiment, weather, artistList);
		});
		weather = "clear-day";
		// getCurrentWeatherAtLocation(request.location.lat, request.location.lon, function(err, locWeather) {
		// 	if(!!err) {
		// 		console.error(err);
		// 	}
		// 	weather = locWeather;
		// 	generatePlaylist(sentiment, weather, artistList);
		// });
		getArtistId(request.artist, function(err, artist) {
			if(!!err) {
				console.error(err);
				return;
			}
			getRelatedArtistIds(artist, function(err, locArtists) {
				if(!!err) {
					console.error(err);
					return;
				}
				
				var locArtistList = locArtists;
				locArtistList.push(artist);
				artistList = locArtistList;
				generatePlaylist(sentiment, weather, artistList);
			});
		});
	});
});

var generatePlaylist = function(sentiment, weather, artistList) {
	if(!sentiment || !weather || !artistList) {
		console.log('Still waiting.');
		return;
	}
	console.log('DONE!');
	var valence = valenceGenerator(sentiment);
	var dAndE = danceabilityAndEnergySelector(weather);
	getPlaylist(
		artistList, 
		10,
		valence,
		dAndE.energyTarget,
		dAndE.energyMin,
		dAndE.energyMax,
		dAndE.danceabilityTarget,
		dAndE.danceabilityMin,
		dAndE.danceabilityMax,
		function(err, songs) {
			if(!!err) {
				console.error(err);
				return;
			}
			console.log(songs);
	});

}
