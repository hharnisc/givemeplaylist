Template.home.helpers({
	playlistRequestsWithRank: function() {
		// NOT WORKINGS
		if (!this.playlistRequests) {
			return;
		}
		this.playlistRequests.rewind();
		return this.playlistRequests.map(function(playlistRequests, index, cursor) {
			playlistRequests._rank = index;
			return playlistRequests;
		});
	},
});