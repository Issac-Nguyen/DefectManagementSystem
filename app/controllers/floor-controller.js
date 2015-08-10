'use strict';
var lodash = require('lodash');
module.exports = function(app) {
	var FloorController = {};
	var FloorService = app.services.Floor;

	FloorController.findByFloorID = function(req, res) {
		FloorService.findByID(req.params.Id, function(err, floor) {
			if (err) {
				return res.json(err);
			}
			return res.json(floor);
		});
	};

	FloorController.findAllWithCallback = function(callback) {
		FloorService.findAll(callback);
	};

	FloorController.findAllFromDateWithCallback = function(dateFrom, callback) {
		FloorService.findAllFromDate(dateFrom, callback);
	};

	return FloorController;
};