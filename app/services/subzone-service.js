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

    return {
        service: SubZoneService,
        serviceName: 'SubZone'
    };
};