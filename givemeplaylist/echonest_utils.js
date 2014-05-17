var echojs = Meteor.require('echojs');
var echo = echojs({
	key: Meteor.settings.echonestApiKey
});


getRelatedArtistIds = function(artist, cb) {
	// callback return values - error, artist ids
	// note: this returns 15 artists by default
	//       to get more the param is `results`	
	echo('artist/similar').get({
		'name': artist
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
