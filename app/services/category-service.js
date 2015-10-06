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

    CategoryService.findAllWithParams = function(params, callback) {
        var objSearch = {};
        if(params.Name)
            objSearch.Name = new RegExp(params.Name);
        if(params.Description)
            objSearch.Description = new RegExp(params.Description);
        if(params.CompanyID)
            objSearch.CompanyID = new RegExp(params.CompanyID);
        if(params.BuildingID)
            objSearch.BuildingID = new RegExp(params.BuildingID);
        var exe = app.models.Category.find(objSearch);
        if(params.sortType && params.sortKey)
            exe.sort(params.sortType == 'ASC' ? params.sortKey : '-' + params.sortKey);
        if(params.pageSize)
            exe.limit(pageSize);
        if(params.pageNumber)
            exe.skip((pageNumber -1) * pageSize)
        return exe.exec(callback);
        // return app.models.Category.find(callback);
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