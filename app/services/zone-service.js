'use strict';
var lodash = require('lodash');
module.exports = function(app) {
	var ZoneService = {};

	ZoneService.findByID = function(Id, callback) {
		return app.models.Zone.findOne({
			_id: Id
		}, callback);
	};

	ZoneService.findAll = function(callback) {
		return app.models.Zone.find({
		}, callback);
	};

	ZoneService.findAllFromDate = function(dateFrom, callback) {
		return app.models.Zone.find({UpdatedOn: {$gte: dateFrom}}, callback);
	};

	return {
		service: ZoneService,
		serviceName: 'Zone'
	};
};