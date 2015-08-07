'use strict';
var lodash = require('lodash');
module.exports = function(app) {
	var PublicUserController = {};
	var PublicUserService = app.services.PublicUser;

	PublicUserController.findByUsername = function(req, res) {
		PublicUserService.findByUsername(req.params.username, function(err, user) {
			if (err) {
				return res.json(err);
			}
			return res.json(user);
		});
	};

	PublicUserController.findByUUID = function(UUID, callback) {
		PublicUserService.findByUUID(UUID, callback);
	}

	PublicUserController.addNewUser = function(obj, cb) {
		PublicUserService.insert(obj, cb);
	}



	return PublicUserController;
};