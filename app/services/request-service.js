'use strict';
var lodash = require('lodash');
module.exports = function(app) {
	var RequestService = {};

	RequestService.findById = function(id, callback) {
		return app.models.Request.findById(id, callback);
	};

	return {
		service: RequestService,
		serviceName: 'Request'
	};
};