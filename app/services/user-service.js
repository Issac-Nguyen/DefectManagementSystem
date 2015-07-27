'use strict';
var lodash = require('lodash');
module.exports = function(app) {
	var UserService = {};

	UserService.findByUsername = function(username, callback) {
		return app.models.User.findOne({
			username: username
		}, callback);
	};

	return {
		service: UserService,
		serviceName: 'User'
	};
};