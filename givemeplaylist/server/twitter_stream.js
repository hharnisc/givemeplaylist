var Fiber = Npm.require('fibers');
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
			generatePlaylist(request._id, sentiment, weather, artistList);
		});
		weather = "clear-day";
		// getCurrentWeatherAtLocation(request.location.lat, request.location.lon, function(err, locWeather) {
		// 	if(!!err) {
		// 		console.error(err);
		// 	}
		// 	weather = locWeather;
		// 	generatePlaylist(request._id, sentiment, weather, artistList);
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
				generatePlaylist(request._id, sentiment, weather, artistList);
			});
		});
	});
});

var generatePlaylist = function(requestId, sentiment, weather, artistList) {
	if(!sentiment || !weather || !artistList) {
		return;
	}
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
			
			Fiber(function() {
				Playlist.insert({
					tracks: songs
				});
				// mark the playlist request as processed
				PlaylistRequest.update(requestId, {$set: {processed: true}});
				console.log('Processed request: ' + requestId);
			}).run();
	});

}
