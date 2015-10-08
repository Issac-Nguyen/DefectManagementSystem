'use strict';
var SubZone = require('../app/models/subzone'),
	async = require('async'),
	_ = require('lodash'),
	fs = require('fs'),
	crypto = require('crypto'),
	uuid = require('node-uuid'),
	settings = require('../app/config/environment'),
	mongoUri = settings.db.url,
	mongoose = require('mongoose').connect(mongoUri);


var zones = [{
	Name: 'SubZone 1',
	ZoneID: mongoose.Types.ObjectId('55b9d874e468c710114e789b'),
	Description: 'Description of SubZone 1'
}, {
	_id: mongoose.Types.ObjectId('55b9d874e468c710114e789c'),
	Name: 'SubZone 2',
	ZoneID: mongoose.Types.ObjectId('55b887653a865464149b0a1e'),
	Description: 'Description of SubZone 2'
}];


async.each(zones, function(zone, callback) {
	SubZone.model.remove({
		Name: zone.Name
	}, function(err) {
		if (err) console.log(err);
		var c = new SubZone.model();
		if(zone._id)
			c._id = zone._id;
		c.Name = zone.Name;
		c.ZoneID = zone.ZoneID;
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