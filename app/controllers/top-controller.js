'use strict';
var lodash = require('lodash');
module.exports = function(app) {
	var TopController = {};
	var TopService = app.services.Top;

	TopController.findByTopID = function(req, res) {
		TopService.findByID(req.params.Id, function(err, building) {
			if (err) {
				return res.json(err);
			}
			return res.json(building);
		});
	};

	TopController.findAll = function(req, res) {
		TopService.findAll(function(err, buildings) {
			if (err) {
				return res.json(err);
			}
			return res.json(buildings);
		});
	};


	TopController.findByID = function(id, callback) {
		TopService.findByID(id, callback);
	};

	TopController.findAllWithCallback = function(callback) {
		TopService.findAll(callback);
	};

	TopController.findAllFromDateWithCallback = function(dateFrom, callback) {
		TopService.findAllFromDate(dateFrom, callback);
	};

	return TopController;
};