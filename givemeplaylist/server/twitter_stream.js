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
		if (tweet.user.screen_name === Meteor.settings.twitterUsername ||
			tweet.retweeted || tweet.text.split("@").length - 1 > 1) {
			// console.log('ignoring tweet ', tweet.text);
			return;
		}
		var message = tweet.text;
		var username = tweet.user.screen_name;
		var profilePic = tweet.user.profile_image_url_https;
		var tweetId = tweet.id_str;

		// default is SF (for now)
		var lat = 37.782225;
		var lon = -122.391205;
		if (!!tweet.geo){
			var coords = tweet.geo.coordinates;
			lat = coords[0];
			lon = coords[1];
			console.log(lat, lon);
		}

		getArtistNameAndIdFromTweet(message, function(err, data) {
			if (!!err) {
				tweetCouldNotFindArtist(username, tweetId);
				return;
			}
			Fiber(function() {
				PlaylistRequest.insert({
					artist: data.name,
					artistId: data.id,
					username: username,
					profilePic: profilePic,
					timestamp: new Date(),
					location: {
						lat: 37.782225,
						lon: -122.391205
					},
					processed: false,
					tweetId: tweetId
				});
			}).run();
		});
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
				generatePlaylist(
					request._id, 
					request.username,
					request.tweetId,
					request.artist,
					sentiment,
					weather,
					artistList
				);
			});
			weather = "sleet";
			// getCurrentWeatherAtLocation(request.location.lat, request.location.lon, function(err, locWeather) {
			// 	if(!!err) {
			// 		console.error(err);
			// 	}
			// 	weather = locWeather;
			// 	generatePlaylist(
			// 		request._id, 
			// 		request.username,
			// 		request.tweetId,
			// 		request.artist,
			// 		sentiment,
			// 		weather,
			// 		artistList
			// );
			// });
			
			getRelatedArtistIds(request.artistId, function(err, locArtists) {
				if(!!err) {
					console.error(err);
					return;
				}
				
				var locArtistList = locArtists;
				locArtistList.push(request.artistId);
				artistList = locArtistList;
				generatePlaylist(
					request._id, 
					request.username,
					request.tweetId,
					request.artist,
					sentiment,
					weather,
					artistList
				);
			});
    	}
	});
});

var generatePlaylist = function(requestId, username, tweetId, artist, sentiment, weather, artistList) {
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
				var playlistId = Playlist.insert({
					tracks: songs
				});
				// mark the playlist request as processed
				PlaylistRequest.update(requestId, {$set: {processed: true, playlistId: playlistId}});
				tweetPlaylistToUser(
					username,
					artist, 
					Meteor.settings.hostname + '/playlist/' + playlistId + '/', 
					tweetId
				);
				console.log('Processed request: ' + requestId);
			}).run();
	});

}
