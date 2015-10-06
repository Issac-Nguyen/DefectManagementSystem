'use strict';
var lodash = require('lodash');
module.exports = function(app) {
	var DepartmentService = {};

	DepartmentService.findByID = function(Id, callback) {
		return app.models.Department.findOne({
			_id: Id
		}, callback);
	};

	DepartmentService.findAll = function(callback) {
		return app.models.Department.find(callback);
	};

	DepartmentService.findAllFromDate = function(dateFrom, callback) {
		return app.models.Department.find({UpdatedOn: {$gte: dateFrom}}, callback);
	};

	return {
		service: DepartmentService,
		serviceName: 'Department'
	};
};