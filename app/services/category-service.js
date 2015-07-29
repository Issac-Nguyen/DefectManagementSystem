'use strict';
var lodash = require('lodash');
module.exports = function(app) {
	var CategoryService = {};

	CategoryService.findByID = function(Id, callback) {
		return app.models.Category.findOne({
			_id: Id
		}, callback);
	};

	CategoryService.findAll = function(callback) {
		return app.models.Category.find({
		}, callback);
	};

	return {
		service: CategoryService,
		serviceName: 'Category'
	};
};