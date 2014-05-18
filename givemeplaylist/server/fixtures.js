if (PlaylistRequest.find().count() === 0) {
	PlaylistRequest.insert({
		artist: 'Bombay Bicycle Club',
		username: 'harrisonplaylis',
		timestamp: new Date(),
		location: {
			lat: 37.782225,
			lon: -122.391205
		},
		processed: false
	});
}