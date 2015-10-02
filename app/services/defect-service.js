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
        console.log('new Defect');
        console.log(newDefect);
        newDefect.save(cb);
    }

    DefectService.updateWithCallback = function(condition, objSet, callback) {
        return app.models.Defect.update(condition, {
            $set: objSet
        }, callback);
    }

    DefectService.updateWithIDAndCallback = function(id, objSet, callback) {
        return app.models.Defect.findByIdAndUpdate(id, {
            $set: objSet
        }, callback);
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

    DefectService.findAllFromDateAndRelateTechnician = function(dateFrom, userID, BuildingList, CategoryList, callback) {
        return app.models.Defect.find({
            UpdatedOn: {
                $gte: dateFrom
            },
            BuildingID: {
                "$in": BuildingList
            },
            CategoryID: {
                "$in": CategoryList
            },
            UpdatedBy: {
                $ne: userID
            },
        }, callback);
    }

    return {
        service: DefectService,
        serviceName: 'Defect'
    };
};