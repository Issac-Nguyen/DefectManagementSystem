'use strict';
var lodash = require('lodash');
module.exports = function(app) {
	var FloorService = {};

	FloorService.findByID = function(Id, callback) {
		return app.models.Floor.findOne({
			_id: Id
		}, callback);
	};

	FloorService.findAll = function(callback) {
		return app.models.Floor.find({
		}, callback);
	};

	return {
		service: FloorService,
		serviceName: 'Floor'
	};
};