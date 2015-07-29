'use strict';
var lodash = require('lodash');
module.exports = function(app) {
	var CompanyController = {};
	var CompanyService = require('../services/company-service');

	CompanyController.findByCompanyID = function(req, res) {
		CompanyService.findByID(req.params.Id, function(err, company) {
			if (err) {
				return res.json(err);
			}
			return res.json(company);
		});
	};

	return CompanyController;
};