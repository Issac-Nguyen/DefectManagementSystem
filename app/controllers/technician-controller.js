'use strict';
var lodash = require('lodash');
module.exports = function(app) {
    var TechnicianController = {};
    var TechnicianService = app.services.Technician;

    TechnicianController.findByUserName = function(username, callback) {
        TechnicianService.findByUserName(username, callback);
    };

    TechnicianController.login = function(username, password, cb) {
        TechnicianService.login(username, password, cb);
    }

    TechnicianController.update = function(id, object, cb) {
        TechnicianService.update(id, object, cb);
    }

    TechnicianController.find = function(condition, callback) {
        TechnicianService.find(condition, callback);
    }



    return TechnicianController;
};