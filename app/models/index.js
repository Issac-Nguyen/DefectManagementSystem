'use strict';
var fs = require('fs'),
	path = require('path'),
	lodash = require('lodash');
module.exports = function(app) {
	app.models = {};

	var conf = app.environment.db;
	var mongoose = require('mongoose');
	mongoose.connect(conf.url);


	fs.readdirSync(__dirname).filter(function(file) {
		return (file.indexOf('.') !== 0) && (file !== 'index.js');
	}).forEach(function(file) {
		var schema = require(path.join(__dirname, file));
		app.models[schema.modelName] = schema.model;
	});
};