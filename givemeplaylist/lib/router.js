Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  // waitOn: function() { 
  //   return [Meteor.subscribe('notifications')]
  // }
});

Router.map(function() {
	this.route('home', {
		path: '/',
		template: 'home'
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