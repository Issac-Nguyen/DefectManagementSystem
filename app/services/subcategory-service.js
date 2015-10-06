'use strict';
var lodash = require('lodash');
module.exports = function(app) {
	var SubCategoryService = {};

	SubCategoryService.findByID = function(Id, callback) {
		return app.models.SubCategory.findOne({
			_id: Id
		}, callback);
	};

	SubCategoryService.findAll = function(callback) {
		return app.models.SubCategory.find(callback);
	};

	SubCategoryService.findAllFromDate = function(dateFrom, callback) {
		return app.models.SubCategory.find({UpdatedOn: {$gte: dateFrom}}, callback);
	};

	return {
		service: SubCategoryService,
		serviceName: 'SubCategory'
	};
};