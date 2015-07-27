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

	return UserController;
};