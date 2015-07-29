'use strict';
var lodash = require('lodash');
module.exports = function(app) {
	var CompanyService = {};

	CompanyService.findByID = function(Id, callback) {
		return app.models.Company.findOne({
			_id: Id
		}, callback);
	};

	return {
		service: CompanyService,
		serviceName: 'Company'
	};
};