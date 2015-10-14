'use strict';
var Department = require('../app/models/department'),
	async = require('async'),
	_ = require('lodash'),
	fs = require('fs'),
	crypto = require('crypto'),
	uuid = require('node-uuid'),
	settings = require('../app/config/environment'),
	mongoUri = settings.db.url,
	mongoose = require('mongoose').connect(mongoUri);


var departments = [{
	_id: mongoose.Types.ObjectId('55b9d6ad76253764161b843a'),
	Name: 'Department 1',
	BuildingID: mongoose.Types.ObjectId('55b886ad6130e64413e2336f'),
	Description: 'Description of Department 1'
}, {
	_id: mongoose.Types.ObjectId('55b9d6ad76253764161b843b'),
	Name: 'Department 2',
	BuildingID: mongoose.Types.ObjectId('55b886ad6130e64413e23370'),
	Description: 'Description of Department 2'
}];


async.each(departments, function(department, callback) {
	Department.model.remove({
		_id: department._id
	}, function(err) {
		if (err) console.log(err);
		var c = new Department.model();
		if(department._id)
			c._id = department._id;
		c.Name = department.Name;
		c.BuildingID = department.BuildingID;
		c.Description = department.Description;
		c.save(function(err) {
			if (err) console.log(err);
			console.log('Created department:' + c.Name);
			callback();
		});
	});
}, function(err) {
	if (err) console.log(err);
	process.exit();
});