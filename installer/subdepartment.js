'use strict';
var SubDepartment = require('../app/models/subdepartment'),
	async = require('async'),
	_ = require('lodash'),
	fs = require('fs'),
	crypto = require('crypto'),
	uuid = require('node-uuid'),
	settings = require('../app/config/environment'),
	mongoUri = settings.db.url,
	mongoose = require('mongoose').connect(mongoUri);


var subdepartments = [{
	Name: 'SubDepartment 1',
	DepartmentID: mongoose.Types.ObjectId('55b9d6ad76253764161b843a'),
	Description: 'Description of SubDepartment 1'
}, {
	Name: 'SubDepartment 2',
	DepartmentID: mongoose.Types.ObjectId('55b9d6ad76253764161b843b'),
	Description: 'Description of SubDepartment 2'
}];


async.each(subdepartments, function(subdepartment, callback) {
	SubDepartment.model.remove({
		Name: subdepartment.Name
	}, function(err) {
		if (err) console.log(err);
		var c = new SubDepartment.model();
		c.Name = subdepartment.Name;
		c.DepartmentID = subdepartment.DepartmentID;
		c.Description = subdepartment.Description;
		c.save(function(err) {
			if (err) console.log(err);
			console.log('Created subdepartment:' + c.Name);
			callback();
		});
	});
}, function(err) {
	if (err) console.log(err);
	process.exit();
});