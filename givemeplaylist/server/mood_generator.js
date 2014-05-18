var valenceGenerator = function(sentimentScore) {
		var valence = 0;
		if (sentimentScore < 40 && sentimentScore > -40) {
			valence = sentimentScore + 40;
			valence = valence / 80;
		}
		else if (sentimentScore >= 40) {
			valence = 1;
		}
		return valence;
}

var danceabilityAndEnergySelector = function(weather) {
	var danceabilityMax = 1.0;
	var danceabilityMin = 0.0;
	var danceabilityTarget = 0.0;
	var energyMax = 1.0;
	var energyMin = 0.0;
	var energyTarget = 0.0;
	var weatherMap = {
		"clear-day": {
			danceabilityMax: 1.0,
			danceabilityMin:  0.2,
			danceabilityTarget: 0.5,
			energyMax: 1.0,
			energyMin: 0.2,
			energyTarget: 0.5
		},
		"clear-night": {
			danceabilityMax: 1.0,
			danceabilityMin:  0.2,
			danceabilityTarget: 0.6,
			energyMax: 1.0,
			energyMin: 0.2,
			energyTarget: 0.6
		},
		"rain": {
			danceabilityMax: 1.0,
			danceabilityMin:  0.0,
			danceabilityTarget: 0.25,
			energyMax: 1.0,
			energyMin: 0.2,
			energyTarget: 0.7
		},
		"wind": {
			danceabilityMax: 1.0,
			danceabilityMin:  0.0,
			danceabilityTarget: 0.0,
			energyMax: 1.0,
			energyMin: 0.2,
			energyTarget: 0.6
		},
		"fog": {
			danceabilityMax: 0.5,
			danceabilityMin:  0.0,
			danceabilityTarget: 0.0,
			energyMax: 0.8,
			energyMin: 0.0,
			energyTarget: 0.0
		}
	}
	if (weather in weatherMap) {
		danceabilityMax = weatherMap[weather].danceabilityMax;
		danceabilityMin = weatherMap[weather].danceabilityMin;
		danceabilityTarget = weatherMap[weather].danceabilityTarget;
		energyMax = weatherMap[weather].energyMax;
		energyMin = weatherMap[weather].energyMin;
		energyTarget = weatherMap[weather].energyTarget;
	}
	return {
		danceabilityMax: danceabilityMax,
		danceabilityMin: danceabilityMin,
		danceabilityTarget: danceabilityTarget,
		energyMax: energyMax,
		energyMin: energyMin,
		energyTarget: energyTarget
	}
}
var weather = 'rain';
console.log(danceabilityAndEnergySelector(weather));