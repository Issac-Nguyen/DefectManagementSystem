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
		return app.models.Category.find(callback);
	};

	CategoryService.findAllFromDate = function(dateFrom, callback) {
		return app.models.Category.find({UpdatedOn: {$gte: dateFrom}}, callback);
	};

	CategoryService.checkExist = function(name, id, cb) {
        return app.models.Category.findOne({
            name: name,
            _id: {
                $ne: id
            }
        }, cb);
    }

    CategoryService.add = function(obj, cb) {
        var Category = new app.models.Category(obj);
        Category.save(cb);
    }

    CategoryService.update = function(id, obj, cb) {
        return app.models.Category.findOneAndUpdate({
            _id: id
        }, obj, cb);
    }

    CategoryService.delete = function(id, cb) {
        return app.models.Category.remove({
            _id: id
        }, cb);
    }

	return {
		service: CategoryService,
		serviceName: 'Category'
	};
};