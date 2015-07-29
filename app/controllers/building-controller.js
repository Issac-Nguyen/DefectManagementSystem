'use strict';
var lodash = require('lodash');
module.exports = function(app) {
	var BuildingController = {};
	var BuildingService = app.services.Building;

	BuildingController.findByBuildingID = function(req, res) {
		BuildingService.findByID(req.params.Id, function(err, building) {
			if (err) {
				return res.json(err);
			}
			return res.json(building);
		});
	};

	BuildingController.findAll = function(req, res) {
		BuildingService.findAll(function(err, buildings) {
			if (err) {
				return res.json(err);
			}
			return res.json(buildings);
		});
	};

	BuildingController.findAllWithCallback = function(callback) {
		BuildingService.findAll(function(err, buildings) {
			if (err) {
				return callback(err);
			}
			return callback(null, buildings);
		});
	};

	return BuildingController;
};