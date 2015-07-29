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
		return app.models.SubCategory.find({
		}, callback);
	};

	return {
		service: SubCategoryService,
		serviceName: 'SubCategory'
	};
};