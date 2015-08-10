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

    DefectService.findAllFromDate = function(dateFrom, callback) {
        return app.models.Defect.find({
            UpdatedOn: {
                $gte: dateFrom
            }
        }, callback);
    }

    return {
        service: DefectService,
        serviceName: 'Defect'
    };
};