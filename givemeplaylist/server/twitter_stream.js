var Fiber = Npm.require('fibers');
twit = new TwitMaker({
	consumer_key: Meteor.settings.twitterApiKey,
	consumer_secret: Meteor.settings.twitterApiSecret,
	access_token: Meteor.settings.twitterAccessToken,
	access_token_secret: Meteor.settings.twitterAccessSecret
});

Meteor.startup(function () {
	var stream = twit.stream('user');
	stream.on('tweet', function(tweet) {
		if (tweet.user.screen_name === Meteor.settings.twitterUsername) {
			return;
		}
		var message = tweet.text;
		var username = tweet.user.screen_name;
		var profilePic = tweet.user.profile_image_url_https;
		var artist = parseArtist(message);

		// default is SF (for now)
		var lat = 37.782225;
		var lon = -122.391205;
		if (!!tweet.geo){
			var coords = tweet.geo.coordinates;
			lat = coords[0];
			lon = coords[1];
			console.log(lat, lon);
		}
		
		Fiber(function() {
			PlaylistRequest.insert({
				artist: artist,
				username: username,
				profilePic: profilePic,
				timestamp: new Date(),
				location: {
					lat: 37.782225,
					lon: -122.391205
				},
				processed: false
			});
		}).run();
	});

	PlaylistRequest.find({processed: false}).observe({
		added: function(request) {
			if(request.username === Meteor.settings.twitterUsername) {
				return;
			}
			var sentiment, weather, artistList;
	      	getUserSentiment(request.username, function(err, score) {
				if(!!err) {
					console.error(err);
				}
				sentiment = score;
				generatePlaylist(request._id, request.username, request.artist, sentiment, weather, artistList);
			});
			weather = "sleet";
			// getCurrentWeatherAtLocation(request.location.lat, request.location.lon, function(err, locWeather) {
			// 	if(!!err) {
			// 		console.error(err);
			// 	}
			// 	weather = locWeather;
			// 	generatePlaylist(request._id, request.username, request.artist, sentiment, weather, artistList);
			// });
			getArtistId(request.artist, function(err, artist) {
				if(!!err) {
					console.error(err);
					tweetCouldNotFindArtist(request.username);
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
					generatePlaylist(request._id, request.username, request.artist, sentiment, weather, artistList);
				});
			});
    	}
	});
});

var generatePlaylist = function(requestId, username, artist, sentiment, weather, artistList) {
	if(!sentiment || !weather || !artistList) {
		return;
	}
	var valence = valenceGenerator(sentiment);
	var dAndE = danceabilityAndEnergySelector(weather);
	console.log(
		10,
		valence,
		dAndE.energyTarget,
		dAndE.energyMin,
		dAndE.energyMax,
		dAndE.danceabilityTarget,
		dAndE.danceabilityMin,
		dAndE.danceabilityMax);
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
				var playlistId = Playlist.insert({
					tracks: songs
				});
				// mark the playlist request as processed
				PlaylistRequest.update(requestId, {$set: {processed: true, playlistId: playlistId}});
				tweetPlaylistToUser(username, artist, Meteor.settings.hostname + '/playlist/' + playlistId + '/');
				console.log('Processed request: ' + requestId);
			}).run();
	});

}
