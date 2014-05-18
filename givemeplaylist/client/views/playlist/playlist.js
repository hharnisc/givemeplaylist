Template.playlist.helpers({
	tracklist: function() {
		if (!this.tracks) {
			return '';
		}
		var strTracks = this.tracks.join();
		return strTracks;
	}
});
