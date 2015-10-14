'use strict';
var lodash = require('lodash');
module.exports = function(app) {
    var UserController = {};
    var UserService = app.services.User;

    UserController.findByUsername = function(req, res) {
        UserService.findByUsername(req.params.username, function(err, user) {
            if (err) {
                return res.json(err);
            }
            return res.json(user);
        });
    };

    UserController.list = function(req, res) {
        UserService.list(req, res);
    }

    UserController.findById = function(id, callback) {
        UserService.findById(id, callback);
    }

    UserController.getMe = function(req, res) {
        UserService.getMe(req, res);
    }

    UserController.update = function(req, res) {
        UserService.update(req, res)
    }

    return UserController;
};