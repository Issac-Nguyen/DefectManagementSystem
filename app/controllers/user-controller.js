'use strict';
var lodash = require('lodash');
module.exports = function(app) {
    var UserController = {};
    var UserService = require('../services/user-service');

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

    return UserController;
};