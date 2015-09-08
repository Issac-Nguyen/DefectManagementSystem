'use strict';
var lodash = require('lodash');
module.exports = function(app) {
	var CompanyController = {};
	var CompanyService = app.services.Company;

	CompanyController.findByCompanyID = function(req, res) {
		CompanyService.findByID(req.params.Id, function(err, building) {
			if (err) {
				return res.json(err);
			}
			return res.json(building);
		});
	};

	CompanyController.findAll = function(req, res) {
		CompanyService.findAll(function(err, companies) {
			if (err) {
				return res.json(err);
			}
			return res.json(companies);
		});
	};


	CompanyController.findByID = function(id, callback) {
		CompanyService.findByID(id, callback);
	};

	CompanyController.findAllWithCallback = function(callback) {
		CompanyService.findAll(callback);
	};

	CompanyController.findAllFromDateWithCallback = function(dateFrom, callback) {
		CompanyService.findAllFromDate(dateFrom, callback);
	};

	return CompanyController;
};