'use strict';
var lodash = require('lodash');
module.exports = function(app) {
	var SubCategoryController = {};
	var SubCategoryService = app.services.SubCategory;

	SubCategoryController.findBySubCategoryID = function(req, res) {
		SubCategoryService.findByID(req.params.Id, function(err, subcategory) {
			if (err) {
				return res.json(err);
			}
			return res.json(subcategory);
		});
	};

	SubCategoryController.findByID = function(id, callback) {
		SubCategoryService.findByID(id, callback);
	};

	SubCategoryController.findAllWithCallback = function(callback) {
		SubCategoryService.findAll(callback);
	};

	SubCategoryController.findAllFromDateWithCallback = function(dateFrom, callback) {
		SubCategoryService.findAllFromDate(dateFrom, callback);
	};

	return SubCategoryController;
};