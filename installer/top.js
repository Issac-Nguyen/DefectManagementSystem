'use strict';
var Top = require('../app/models/top'),
	async = require('async'),
	_ = require('lodash'),
	fs = require('fs'),
	crypto = require('crypto'),
	uuid = require('node-uuid'),
	settings = require('../app/config/environment'),
	mongoUri = settings.db.url,
	mongoose = require('mongoose').connect(mongoUri);


var tops = [{
	Name: 'Top 1',
}, {
	Name: 'Top 2',
}];


async.each(tops, function(top, callback) {
	Top.model.remove({
		Name: top.Name
	}, function(err) {
		if (err) console.log(err);
		var c = new Top.model();
		if(top._id)
			c._id = top._id;
		c.Name = top.Name;
		c.save(function(err) {
			if (err) console.log(err);
			console.log('Created top:' + c.Name);
			callback();
		});
	});
}, function(err) {
	if (err) console.log(err);
	process.exit();
});