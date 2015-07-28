'use strict';
var lodash = require('lodash');
module.exports = function(app) {
	var DefectService = {};

	DefectService.findByID = function(Id, callback) {
		return app.models.Defect.findOne({
			_id: Id
		}, callback);
	};

	return {
		service: DefectService,
		serviceName: 'Defect'
	};
};