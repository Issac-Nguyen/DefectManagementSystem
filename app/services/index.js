'use strict';
var fs = require('fs'),
	path = require('path'),
	lodash = require('lodash');
module.exports = function(app) {
	app.services = {};

	fs.readdirSync(__dirname).filter(function(file) {
		return (file.indexOf('.') !== 0) && (file !== 'index.js');
	}).forEach(function(file) {
		var service = require(path.join(__dirname, file))(app);
		app.services[service.serviceName] = service.service;
	});
};