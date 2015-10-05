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

    SubZoneService.findAllFromDate = function(dateFrom, callback) {
        return app.models.SubZone.find({
            UpdatedOn: {
                $gte: dateFrom
            }
        }, callback);
    };

    SubZoneService.checkExist = function(name, id, cb) {
        return app.models.SubZone.findOne({
            name: name,
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