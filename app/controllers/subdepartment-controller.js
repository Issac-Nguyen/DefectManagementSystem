'use strict';
var lodash = require('lodash');
module.exports = function(app) {
	var SubDepartmentController = {};
	var SubDepartmentService = app.services.SubDepartment;

	SubDepartmentController.findBySubDepartmentID = function(req, res) {
		SubDepartmentService.findByID(req.params.Id, function(err, subdepartment) {
			if (err) {
				return res.json(err);
			}
			return res.json(subdepartment);
		});
	};

	SubDepartmentController.findAllWithCallback = function(callback) {
		SubDepartmentService.findAll(callback);
	};

	SubDepartmentController.findAllFromDateWithCallback = function(dateFrom, callback) {
		SubDepartmentService.findAllFromDate(dateFrom, callback);
	};

	return SubDepartmentController;
};