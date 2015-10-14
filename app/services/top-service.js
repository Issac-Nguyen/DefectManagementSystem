'use strict';
var lodash = require('lodash');
module.exports = function(app) {
    var TopService = {};

    TopService.findByID = function(Id, callback) {
        return app.models.Top.findOne({
            _id: Id
        }, callback);
    };

    TopService.findByName = function(name, callback) {
        return app.models.Top.findOne({
            Name: name
        }, callback);
    };

    TopService.findAllWithParams = function(params, callback) {
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
        var exe = app.models.Top.find(objSearch);
        //sort
        if (params.sortType && params.sortKey) {
            sortStr = params.sortType == 'ASC' ? params.sortKey : '-' + params.sortKey;
        }
        sortStr = sortStr + ' -UpdatedOn';
        exe.sort(sortStr);
        //end sort
        //page
        if (params.pageSize)
            exe.limit(params.pageSize);
        if (params.pageNumber)
            exe.skip((params.pageNumber - 1) * params.pageSize)
            //end page
        return exe.exec(function(err, tops) {
            if (err)
                return callback(err);
            app.models.Top.count(objSearch, function(err1, cnt) {
                if (err1)
                    return callback(err1);
                callback(null, {
                    items: tops,
                    totalItems: cnt
                });
            })
        });
    };

    TopService.findAll = function(callback) {
        return app.models.Top.find({}, callback);
    };

    TopService.findAllFromDate = function(dateFrom, cb) {
        return app.models.Top.find({
            UpdatedOn: {
                $gte: dateFrom
            }
        }, cb);
    }

    TopService.checkExist = function(name, id, cb) {
        return app.models.Top.findOne({
            Name: name,
            _id: {
                $ne: id
            }
        }, cb);
    }

    TopService.add = function(obj, cb) {
        var top = new app.models.Top(obj);
        top.save(cb);
    }

    TopService.update = function(id, obj, cb) {
        obj.UpdatedOn = new Date();
        return app.models.Top.findOneAndUpdate({
            _id: id
        }, obj, cb);
    }

    TopService.delete = function(id, cb) {
        return app.models.Top.remove({
            _id: id
        }, cb);
    }

    return {
        service: TopService,
        serviceName: 'Top'
    };
};