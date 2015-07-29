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

	ZoneController.findAllWithCallback = function(callback) {
		ZoneService.findAll(function(err, zones) {
			if (err) {
				return callback(err);
			}
			return callback(null, zones);
		});
	};

	return ZoneController;
};