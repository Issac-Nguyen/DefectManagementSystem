'use strict';
var lodash = require('lodash');
module.exports = function(app) {
	var TopService = {};

	TopService.findByID = function(Id, callback) {
		return app.models.Top.findOne({
			_id: Id
		}, callback);
	};

	TopService.findAll = function(callback) {
		return app.models.Top.find({
		}, callback);
	};

	TopService.findAllFromDate = function(dateFrom, cb) {
		return app.models.Top.find({UpdatedOn: {$gte: dateFrom}}, cb);
	}

	return {
		service: TopService,
		serviceName: 'Top'
	};
};