'use strict';
var lodash = require('lodash');
module.exports = function(app) {
    var DefectController = {};
    var DefectService = app.services.Defect;

    DefectController.findByDefectID = function(req, res) {
        DefectService.findByID(req.params.Id, function(err, defect) {
            if (err) {
                return res.json(err);
            }
            return res.json(defect);
        });
    }


    DefectController.add = function(data, callback) {
        DefectService.add(data, callback);
    }

    DefectController.findAllFromDateWithCallback = function(dateFrom, callback) {
        DefectService.findAllFromDate(dateFrom, callback);
    }

    return DefectController;
};