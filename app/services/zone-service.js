'use strict';
var lodash = require('lodash');
module.exports = function(app) {
    var ZoneService = {};

    ZoneService.findByID = function(Id, callback) {
        return app.models.Zone.findOne({
            _id: Id
        }, callback);
    };

    ZoneService.findAll = function(callback) {
        return app.models.Zone.find({}, callback);
    };

    ZoneService.findAllWithParams = function(params, callback) {
        var sortStr = '';
        //search
        var objSearch = {};
        if (params.Name)
            objSearch.Name = new RegExp(params.Name);
        if (params.Description)
            objSearch.Description = new RegExp(params.Description);
        if (params.BuildingID)
            objSearch.BuildingID = new RegExp(params.BuildingID);
        //end search
        var exe = app.models.Zone.find(objSearch);
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
        return exe.exec(function(err, zones) {
            if (err)
                return callback(err);
            app.models.Zone.count(objSearch, function(err1, cnt) {
                if (err1)
                    return callback(err1);
                callback(null, {
                    items: zones,
                    totalItems: cnt
                });
            })
        });
    };

    ZoneService.findAllFromDate = function(dateFrom, callback) {
        return app.models.Zone.find({
            UpdatedOn: {
                $gte: dateFrom
            }
        }, callback);
    };

    ZoneService.checkExist = function(name, id, cb) {
        return app.models.Zone.findOne({
            Name: name,
            _id: {
                $ne: id
            }
        }, cb);
    }

    ZoneService.add = function(obj, cb) {
        var Zone = new app.models.Zone(obj);
        Zone.save(cb);
    }

    ZoneService.update = function(id, obj, cb) {
        obj.UpdatedOn = new Date();
        return app.models.Zone.findOneAndUpdate({
            _id: id
        }, obj, cb);
    }

    ZoneService.delete = function(id, cb) {
        return app.models.Zone.remove({
            _id: id
        }, cb);
    }

    return {
        service: ZoneService,
        serviceName: 'Zone'
    };
};