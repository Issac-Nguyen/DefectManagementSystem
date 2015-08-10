'use strict';
var lodash = require('lodash');
module.exports = function(app) {
	var CategoryController = {};
	var CategoryService = app.services.Category;

	CategoryController.findByCategoryID = function(req, res) {
		CategoryService.findByID(req.params.Id, function(err, category) {
			if (err) {
				return res.json(err);
			}
			return res.json(category);
		});
	};

	CategoryController.findAllWithCallback = function(callback) {
		CategoryService.findAll(callback);
	};

	CategoryController.findAllFromDateWithCallback = function(dateFrom, callback) {
		CategoryService.findAllFromDate(dateFrom, callback);
	};

	return CategoryController;
};