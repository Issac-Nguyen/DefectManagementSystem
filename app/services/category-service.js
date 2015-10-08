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
        var sortStr = '';
        //search
        var objSearch = {};
        if (params.Name)
            objSearch.Name = new RegExp(params.Name);
        if (params.Description)
            objSearch.Description = new RegExp(params.Description);
        if (params.CompanyID)
            objSearch.CompanyID = new RegExp(params.CompanyID);
        if (params.BuildingID)
            objSearch.BuildingID = new RegExp(params.BuildingID);
        //end search
        var exe = app.models.Category.find(objSearch);
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
            if (err)
                return callback(err);
            app.models.Category.count(objSearch, function(err1, cnt) {
                if (err1)
                    return callback(err1);
                callback(null, {
                    items: categorys,
                    totalItems: cnt
                });
            })
        });
        // return app.models.Category.find(callback);
    };

    CategoryService.findAllFromDate = function(dateFrom, callback) {
        return app.models.Category.find({
            UpdatedOn: {
                $gte: dateFrom
            }
        }, callback);
    };

    CategoryService.checkExist = function(name, id, cb) {
        return app.models.Category.findOne({
            Name: name,
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
        obj.UpdatedOn = new Date();
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