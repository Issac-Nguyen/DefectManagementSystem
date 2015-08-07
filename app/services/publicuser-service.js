'use strict';
var lodash = require('lodash');
module.exports = function(app) {
	var PublicUserService = {};

	PublicUserService.findByUsername = function(username, callback) {
		return app.models.User.findOne({
			username: username
		}, callback);
	};

	PublicUserService.findByUUID = function(UUID, callback) {
		app.models.PublicUser.findOne({
			UUID: UUID
		}, callback);
	}

	PublicUserService.insert = function(obj, callback) {
		app.models.PublicUser.findOneAndUpdate(obj, obj, {upsert:true}, callback);
		// var newPublicUser = new app.models.PublicUser(obj);
		// console.log(obj);
		// newPublicUser.save(function(err, user) {
		// 	callback(err, user);
		// });
	}

	return {
		service: PublicUserService,
		serviceName: 'PublicUser'
	};
};