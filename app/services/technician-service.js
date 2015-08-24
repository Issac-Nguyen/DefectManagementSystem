'use strict';
var lodash = require('lodash');
module.exports = function(app) {
    var TechnicianService = {};

	TechincianService.findByName = function(username, callback) {
		return app.models.Technician.findOne({
			username: username
		}, callback);
	};

	TechnicianService.login = function(username, password, callback) {
		app.models.Techincian.findOne({username: username}, function(err, technician) {
			if(err)
				return callback(err);
			if(technician.checkPassword(password)) {
				callback(null, technician);
			}
		});
	}

	return {
		service: TechnicianService,
		serviceName: 'Techincian'
	};
};