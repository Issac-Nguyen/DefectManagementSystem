'use strict';
var lodash = require('lodash');
module.exports = function(app) {
    var SubZoneService = {};

    SubZoneService.findByID = function(Id, callback) {
        return app.models.SubZone.findOne({
            _id: Id
        }, callback);
    };

    SubZoneService.findAll = function(callback) {
        return app.models.SubZone.find({}, callback);
    };

    SubZoneService.findAllWithParams = function(params, callback) {
        var sortStr = '';
        //search
        var objSearch = {};
        if (params.Name)
            objSearch.Name = new RegExp(params.Name);
        if (params.Description)
            objSearch.Description = new RegExp(params.Description);
        if (params.ZoneID)
            objSearch.ZoneID = new RegExp(params.ZoneID);
        //end search
        var exe = app.models.SubZone.find(objSearch);
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
            app.models.SubZone.count(objSearch, function(err1, cnt) {
                if (err1)
                    return callback(err1);
                callback(null, {
                    items: categorys,
                    totalItems: cnt
                });
            })
        });
    };

    SubZoneService.findAllFromDate = function(dateFrom, callback) {
        return app.models.SubZone.find({
            UpdatedOn: {
                $gte: dateFrom
            }
        }, callback);
    };

    SubZoneService.checkExist = function(name, id, cb) {
        return app.models.SubZone.findOne({
            Name: name,
            _id: {
                $ne: id
            }
        }, cb);
    }

    SubZoneService.add = function(obj, cb) {
        var SubZone = new app.models.SubZone(obj);
        SubZone.save(cb);
    }

    SubZoneService.update = function(id, obj, cb) {
        obj.UpdatedOn = new Date();
        return app.models.SubZone.findOneAndUpdate({
            _id: id
        }, obj, cb);
    }

    SubZoneService.delete = function(id, cb) {
        return app.models.SubZone.remove({
            _id: id
        }, cb);
    }

    return {
        service: SubZoneService,
        serviceName: 'SubZone'
    };
};