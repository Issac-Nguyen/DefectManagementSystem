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
            name: name,
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