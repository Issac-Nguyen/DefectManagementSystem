'use strict';
var Zone = require('../app/models/zone'),
	async = require('async'),
	_ = require('lodash'),
	fs = require('fs'),
	crypto = require('crypto'),
	uuid = require('node-uuid'),
	settings = require('../app/config/environment'),
	mongoUri = settings.db.url,
	mongoose = require('mongoose').connect(mongoUri);


var zones = [{
	Name: 'Zone 1',
	BuildingID: mongoose.Types.ObjectId('55b886ad6130e64413e2336f'),
	Description: 'Description of Zone 1'
}, {
	_id: mongoose.Types.ObjectId('55b886ad6130e64413e23370'),
	Name: 'Zone 2',
	BuildingID: mongoose.Types.ObjectId('55b887653a865464149b0a1e'),
	Description: 'Description of Zone 2'
}];


async.each(zones, function(zone, callback) {
	Zone.model.remove({
		Name: zone.name
	}, function(err) {
		if (err) console.log(err);
		var c = new Zone.model();
		c.Name = zone.Name;
		c.BuildingID = zone.BuildingID;
		c.Description = zone.Description;
		c.save(function(err) {
			if (err) console.log(err);
			console.log('Created zone:' + c.Name);
			callback();
		});
	});
}, function(err) {
	if (err) console.log(err);
	process.exit();
});