'use strict';
var lodash = require('lodash');
module.exports = function(app) {
    var UserService = {};

    UserService.findByUsername = function(username, callback) {
        return app.models.User.findOne({
            username: username
        }, callback);
    };

    UserService.findById = function(id, callback) {
        return app.models.User.findOne({
            _id: id
        }, callback);
    };

    UserService.list = function(req, res) {
        User.find(function(err, users) {
            if (err) return res.send(500);
            res.send(users);
        });
    }

    UserService.getMe = function(req, res) {
        res.send(req.user);
    }


    return {
        service: UserService,
        serviceName: 'User'
    };
};