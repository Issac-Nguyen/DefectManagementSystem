'use strict';
var lodash = require('lodash');
module.exports = function(app) {
	var ZoneController = {};
	var ZoneService = app.services.Zone;

	ZoneController.findByZoneID = function(req, res) {
		ZoneService.findByID(req.params.Id, function(err, zone) {
			if (err) {
				return res.json(err);
			}
			return res.json(zone);
		});
	};

	ZoneController.findByID = function(id, callback) {
		ZoneService.findByID(id, callback);
	};

	ZoneController.findAllWithCallback = function(callback) {
		ZoneService.findAll(callback);
	};

	ZoneController.findAllFromDateWithCallback = function(dateFrom, callback) {
		ZoneService.findAllFromDate(dateFrom, callback);
	};

	return ZoneController;
};