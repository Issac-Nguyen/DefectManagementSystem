'use strict';
var lodash = require('lodash');
module.exports = function(app) {
    var TechnicianService = {};

    TechnicianService.findByUserName = function(username, callback) {
        return app.models.Technician.findOne({
            Username: username
        }, callback);
    };

    TechnicianService.update = function(id, object, callback) {
        return app.models.Technician.update({ _id: id }, { $set: object}, callback);
    };

    TechnicianService.login = function(username, password, callback) {
        app.models.Technician.findOne({
            Username: username
        }, function(err, technician) {
            if (err)
                return callback(err);
            if (technician) {
                if (technician.checkPassword(password)) {
                    callback(null, technician);
                } else {
                    callback(new Error('authentication fail'));
                }
            } else {
                callback(new Error('Not Found any Technician!'));
            }
        });
    }

    TechnicianService.find = function(condition, callback) {
        app.models.Technician.find(condition, callback);
    }

    return {
        service: TechnicianService,
        serviceName: 'Technician'
    };
};