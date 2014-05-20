var echojs = Meteor.require('echojs');
var echo = echojs({
	key: Meteor.settings.echonestApiKey
});

getArtistNameAndIdFromTweet = function(tweetText, cb){
	var processedText = removeUsernames(tweetText);
	console.log(processedText)
	echo('artist/extract').get({
		text: processedText,
		sort: "hotttnesss-desc",
		results: 1
	}, function(err, data) {
		if(!!err) {
			cb(err, undefined);
			return;
		}
		var artists = data.response.artists;
		if (artists.length < 1) {
			getArtistId(processedText.trim(), cb);
		} else {
			cb(undefined, {
				name: artists[0].name,
				id: artists[0].id
			});	
		}		
	});
};

getArtistId = function(artist, cb) {
	echo('artist/search').get({
		name: artist,
		results: 1
	}, function(err, data) {
		if(!!err) {
			cb(err, undefined);
			return;
		}
		var artists = data.response.artists;
		if (artists.length < 1) {
			cb('Could not find artist', undefined);
			return;
		}
		cb(undefined, {
			name: artists[0].name,
			id: artists[0].id
		});
	});
};


getRelatedArtistIds = function(artistId, cb) {
	// callback return values - error, artist ids
	// note: this returns 15 artists by default
	//       to get more the param is `results`	
	echo('artist/similar').get({
		id: artistId,
		results: 4
	}, function(err, data) {
		if (!!err) {
			cb(err, undefined);
			return;
		}
		var artistIds = [];
		_.forEach(data.response.artists, function(artist) {
			artistIds.push(artist.id);
		})
		cb(undefined, artistIds);
	});
};


getPlaylist = function(artistId, results, targetValence, targetEnergy, minEnergy, maxEnergy, targetDanceability, minDanceability, maxDanceability, cb) {
	echo('playlist/static').get({
		artist_id: artistId,
		results: results * 3,
		target_valence: targetValence,
		target_energy: targetEnergy,
		min_energy: minEnergy,
		max_energy: maxEnergy,
		target_danceability: targetDanceability,
		min_danceability: minDanceability,
		max_danceability: maxDanceability,
		song_selection: "song_hotttnesss",
		bucket: ["id:spotify-US", "tracks" ],
		variety: 1.0,
		adventurousness: 0.2,
		sort: "song_hotttnesss-desc",
		distribution: "wandering"
	}, function(err, data) {
		if (!!err) {
			cb(err, undefined);
			return;
		}
		var songs = [];
		_.forEach(data.response.songs, function(song) {
			if (songs.length < 10 && song.tracks.length){
				songs.push(song.tracks[0].foreign_id.replace('spotify-US:track:', ''))
			}
		});
		cb(undefined, songs);
	});
};