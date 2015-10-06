'use strict';
var lodash = require('lodash');
module.exports = function(app) {
	var CompanyService = {};

	CompanyService.findByID = function(Id, callback) {
		return app.models.Company.findOne({
			_id: Id
		}, callback);
	};

	CompanyService.findAll = function(callback) {
		return app.models.Company.find({
		}, callback);
	};

	CompanyService.findAllFromDate = function(dateFrom, cb) {
		return app.models.Company.find({UpdatedOn: {$gte: dateFrom}}, cb);
	}

	return {
		service: CompanyService,
		serviceName: 'Company'
	};
};