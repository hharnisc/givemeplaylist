Meteor.publish('singlePlaylist', function(id) {
	return id && Playlist.find(id);
});

Meteor.publish('recentPlaylistRequests', function() {
	return PlaylistRequest.find({}, {sort: {timestamp: -1}, limit: 20});
});