'use strict';
var lodash = require('lodash');
module.exports = function(app) {
    var SubZoneController = {};
    var SubZoneService = app.services.SubZone;

    SubZoneController.findBySubZoneID = function(req, res) {
        SubZoneService.findByID(req.params.Id, function(err, subzone) {
            if (err) {
                return res.json(err);
            }
            return res.json(subzone);
        });
    };

    SubZoneController.findAllWithCallback = function(callback) {
        SubZoneService.findAll(callback);
    }

	SubZoneController.findAllFromDateWithCallback = function(dateFrom, callback) {
        SubZoneService.findAllFromDate(dateFrom, callback);
    }

return SubZoneController;
};