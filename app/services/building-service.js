'use strict';
var lodash = require('lodash');
module.exports = function(app) {
	var BuildingService = {};

	BuildingService.findByID = function(Id, callback) {
		return app.models.Building.findOne({
			_id: Id
		}, callback);
	};

	BuildingService.findAll = function(callback) {
		return app.models.Building.find({
		}, callback);
	};

	return {
		service: BuildingService,
		serviceName: 'Building'
	};
};