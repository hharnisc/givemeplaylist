var Forecast = Meteor.require('forecast.io');
var forecast = new Forecast({
	APIKey: Meteor.settings.forecastApiKey
});

getCurrentWeatherAtLocation = function(lat, lon, cb) {
	// callback return values - error, forecast	
	forecast.get(lat, lon, function (err, res, data) {
		if (!!err) {
			cb(err, undefined);
			return;
		}
		cb(undefined, data.currently.icon);
	});
};