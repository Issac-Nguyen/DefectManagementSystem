'use strict';
var lodash = require('lodash');
module.exports = function(app) {
	var DefectController = {};
	var DefectService = require('../services/defect-service');

	DefectController.findByDefectID = function(req, res) {
		DefectService.findByDefectname(req.params.Id, function(err, defect) {
			if (err) {
				return res.json(err);
			}
			return res.json(defect);
		});
	};

	return DefectController;
};