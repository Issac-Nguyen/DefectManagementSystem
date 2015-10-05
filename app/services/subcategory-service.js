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

	SubCategoryService.checkExist = function(name, id, cb) {
        return app.models.SubCategory.findOne({
            name: name,
            _id: {
                $ne: id
            }
        }, cb);
    }

    SubCategoryService.add = function(obj, cb) {
        var SubCategory = new app.models.SubCategory(obj);
        SubCategory.save(cb);
    }

    SubCategoryService.update = function(id, obj, cb) {
        return app.models.SubCategory.findOneAndUpdate({
            _id: id
        }, obj, cb);
    }

    SubCategoryService.delete = function(id, cb) {
        return app.models.SubCategory.remove({
            _id: id
        }, cb);
    }

	return {
		service: SubCategoryService,
		serviceName: 'SubCategory'
	};
};