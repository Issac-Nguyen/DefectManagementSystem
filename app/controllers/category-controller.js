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
		CategoryService.findAll(function(err, categorys) {
			if (err) {
				return callback(err);
			}
			return callback(null, categorys);
		});
	};

	return CategoryController;
};