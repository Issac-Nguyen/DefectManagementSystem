'use strict';
var lodash = require('lodash');
module.exports = function(app) {
	var SubDepartmentService = {};

	SubDepartmentService.findByID = function(Id, callback) {
		return app.models.SubDepartment.findOne({
			_id: Id
		}, callback);
	};

	SubDepartmentService.findAll = function(callback) {
		return app.models.SubDepartment.find({
		}, callback);
	};

	return {
		service: SubDepartmentService,
		serviceName: 'SubDepartment'
	};
};