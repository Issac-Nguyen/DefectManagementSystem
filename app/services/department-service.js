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
		return app.models.Department.find({
		}, callback);
	};

	return {
		service: DepartmentService,
		serviceName: 'Department'
	};
};