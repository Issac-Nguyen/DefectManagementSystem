'use strict';
var lodash = require('lodash');
module.exports = function(app) {
    var BuildingService = {};

    BuildingService.findByID = function(Id, callback) {
        return app.models.Building.findOne({
            _id: Id
        }, callback);
    };

    BuildingService.findAll = function(callback) {
        return app.models.Building.find({}, callback);
    };

    BuildingService.findAllWithParams = function(params, callback) {
        var sortStr = '';
        //search
        var objSearch = {};
        if (params.Name)
            objSearch.Name = new RegExp(params.Name);
        if (params.Description)
            objSearch.Description = new RegExp(params.Description);
        if (params.CompanyID)
            objSearch.CompanyID = new RegExp(params.CompanyID);
        //end search
        var exe = app.models.Building.find(objSearch);
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
        return exe.exec(function(err, categorys) {
            if (err)
                return callback(err);
            app.models.Building.count(objSearch, function(err1, cnt) {
                if (err1)
                    return callback(err1);
                callback(null, {
                    items: categorys,
                    totalItems: cnt
                });
            })
        });
    };

    BuildingService.findAllFromDate = function(dateFrom, cb) {
        return app.models.Building.find({
            UpdatedOn: {
                $gte: dateFrom
            }
        }, cb);
    }

    BuildingService.checkExist = function(name, id, cb) {
        return app.models.Building.findOne({
            Name: name,
            _id: {
                $ne: id
            }
        }, cb);
    }

    BuildingService.add = function(obj, cb) {
        var Building = new app.models.Building(obj);
        Building.save(cb);
    }

    BuildingService.update = function(id, obj, cb) {
        obj.UpdatedOn = new Date();
        return app.models.Building.findOneAndUpdate({
            _id: id
        }, obj, cb);
    }

    BuildingService.delete = function(id, cb) {
        return app.models.Building.remove({
            _id: id
        }, cb);
    }

    return {
        service: BuildingService,
        serviceName: 'Building'
    };
};