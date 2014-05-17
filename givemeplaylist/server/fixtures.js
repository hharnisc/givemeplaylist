if (PlaylistRequest.find().count() === 0) {
	PlaylistRequest.insert({
		artist: 'Dan Croll',
		username: 'harrisonplaylis',
		timestamp: new Date(),
		location: {
			lat: 44.2927839,
			lon: -88.41006552
		},
		processed: false
	});
}