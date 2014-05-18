Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading'
});

Router.map(function() {
	this.route('home', {
		path: '/',
		template: 'home',
		waitOn: function() {
			return Meteor.subscribe('recentPlaylistRequests');
		},
		data: function() {
			return {
				playlistRequests: PlaylistRequest.find({}, {sort: {timestamp: -1}, limit: 20})
			}
		}
	});

	this.route('playlist', {
		path: '/playlist/:_id',
		template: 'playlist',
		waitOn: function() {
			return Meteor.subscribe('singlePlaylist', this.params._id);
		},
  		data: function() {
  			return Playlist.findOne(this.params._id);
  		}
	});
});