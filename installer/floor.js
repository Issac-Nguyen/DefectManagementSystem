'use strict';
var Floor = require('../app/models/floor'),
	async = require('async'),
	_ = require('lodash'),
	fs = require('fs'),
	crypto = require('crypto'),
	uuid = require('node-uuid'),
	settings = require('../app/config/environment'),
	mongoUri = settings.db.url,
	mongoose = require('mongoose').connect(mongoUri);


var floors = [{
	Name: 'Floor 1',
	BuildingID: mongoose.Types.ObjectId('55b886ad6130e64413e2336f'),
	Description: 'Description of Floor 1'
}, {
	_id: mongoose.Types.ObjectId('55b886ad6130e64413e23370'),
	Name: 'Floor 2',
	BuildingID: mongoose.Types.ObjectId('55b887653a865464149b0a1e'),
	Description: 'Description of Floor 2'
}];


async.each(floors, function(floor, callback) {
	Floor.model.remove({
		Name: floor.name
	}, function(err) {
		if (err) console.log(err);
		var c = new Floor.model();
		c.Name = floor.Name;
		c.BuildingID = floor.BuildingID;
		c.Description = floor.Description;
		c.save(function(err) {
			if (err) console.log(err);
			console.log('Created floor:' + c.Name);
			callback();
		});
	});
}, function(err) {
	if (err) console.log(err);
	process.exit();
});