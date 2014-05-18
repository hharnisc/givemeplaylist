Meteor.publish('singlePlaylist', function(id) {
	return id && Playlist.find(id);
});