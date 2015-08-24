'use strict';
var lodash = require('lodash');
module.exports = function(app) {
    var TechnicianController = {};
    var TechincianService = app.services.Technician;

    TechincianController.findByTechincianname = function(req, res) {
        TechincianService.findByName(req.params.username, function(err, teachnician) {
            if (err) {
                return res.json(err);
            }
            return res.json(teachnician);
        });
    };

    TechnicianController.login = function(username, password, cb) {
        TechincianService.login(username, password, cb);
    }



    return TechincianController;
};