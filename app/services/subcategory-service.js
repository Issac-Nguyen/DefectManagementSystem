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

    SubCategoryService.findAllWithParams = function(params, callback) {
        var sortStr = '';
        //search
        var objSearch = {};
        if (params.Name)
            objSearch.Name = new RegExp(params.Name);
        if (params.Description)
            objSearch.Description = new RegExp(params.Description);
        if (params.CategoryID)
            objSearch.CategoryID = new RegExp(params.CategoryID);
        //end search
        var exe = app.models.SubCategory.find(objSearch);
        //sort
        if (params.sortType && params.sortKey) {
            sortStr = params.sortType == 'ASC' ? params.sortKey : '-' + params.sortKey;
        }
        sortStr = sortStr + ' -UpdatedOn';
        console.log(sortStr);
        exe.sort(sortStr);
        //end sort
        //page
        if (params.pageSize)
            exe.limit(params.pageSize);
        if (params.pageNumber)
            exe.skip((params.pageNumber - 1) * params.pageSize)
        //end page
        return exe.exec(function(err, categorys) {
            if(err)
                return callback(err);
            app.models.SubCategory.count(objSearch, function(err1, cnt) {
                if(err1)
                    return callback(err1);
                callback(null, {
                    items: categorys,
                    totalItems: cnt
                });
            })
        });
    };

	SubCategoryService.findAllFromDate = function(dateFrom, callback) {
		return app.models.SubCategory.find({UpdatedOn: {$gte: dateFrom}}, callback);
	};

	SubCategoryService.checkExist = function(Name, id, cb) {
        return app.models.SubCategory.findOne({
            Name: Name,
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
        obj.UpdatedOn = new Date();
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