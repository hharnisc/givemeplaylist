var Forecast = Meteor.require('forecast.io');

getCurrentWeatherAtLocation = function(lat, lon, cb) {
	// callback return values - error, forecast
	forecast = new Forecast({APIKey: Meteor.settings.forecastApiKey});
	forecast.get(lat, lon, function (err, res, data) {
		if (!!err) {
			cb(err, undefined);
		}
		cb(undefined, data.currently.icon);
	});
};