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

	SubCategoryController.findAllWithCallback = function(callback) {
		SubCategoryService.findAll(function(err, subsubcategorys) {
			if (err) {
				return callback(err);
			}
			return callback(null, subsubcategorys);
		});
	};

	return SubCategoryController;
};