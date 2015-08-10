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

	SubDepartmentService.findAllFromDate = function(dateFrom, callback) {
		return app.models.SubDepartment.find({
            UpdatedOn: {
                $gte: dateFrom
            }
        }, callback);
	};

	return {
		service: SubDepartmentService,
		serviceName: 'SubDepartment'
	};
};