'use strict';
var lodash = require('lodash');
module.exports = function(app) {
    var DefectService = {};

    DefectService.findByID = function(Id, callback) {
        return app.models.Defect.findOne({
            _id: Id
        }, callback);
    };

    DefectService.add = function(data, cb) {
        var newDefect = new app.models.Defect(data);
        newDefect.save(cb);
    }

    DefectService.upsert = function(data, cb) {
        var newDefect = new app.models.Defect(data);
        // newDefect.save(cb);
        app.models.Defect.findOneAndUpdate({
            idDefect: newDefect.idDefect
        }, {
            $set: data
        }, {
            upsert: true
        }, cb);
    }

    DefectService.findAllFromDate = function(dateFrom, callback) {
        return app.models.Defect.find({
            UpdatedOn: {
                $gte: dateFrom
            }
        }, callback);
    }

    DefectService.findAllFromDateAndRelateTechnician = function(dateFrom, BuildingList, CategoryList, callback) {
        return app.models.Defect.find({
            UpdatedOn: {
                $gte: dateFrom
            },
            BuildingID: {
                "$in": BuildingList
            },
            CategoryID: {
                "$in": CategoryList
            }
        }, callback);
    }

    return {
        service: DefectService,
        serviceName: 'Defect'
    };
};