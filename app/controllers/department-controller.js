'use strict';
var lodash = require('lodash');
module.exports = function(app) {
	var DepartmentController = {};
	var DepartmentService = app.services.Department;

	DepartmentController.findByDepartmentID = function(req, res) {
		DepartmentService.findByID(req.params.Id, function(err, department) {
			if (err) {
				return res.json(err);
			}
			return res.json(department);
		});
	};

	DepartmentController.findAllWithCallback = function(callback) {
		DepartmentService.findAll(function(err, departments) {
			if (err) {
				return callback(err);
			}
			return callback(null, departments);
		});
	};

	return DepartmentController;
};