'use strict';
var User = require('../app/models/user'),
	async = require('async'),
	_ = require('lodash'),
	fs = require('fs'),
	crypto = require('crypto'),
	uuid = require('node-uuid'),
	settings = require('../app/config/environment'),
	mongoUri = settings.db.url,
	mongoose = require('mongoose').connect(mongoUri);


var users = [{
	local:{
		username: '123@abc.com',
		password: '123'
	}
}];


async.each(users, function(user, callback) {
	User.model.remove({
		'local.username': user.local.username
	}, function(err) {
		if (err) console.log(err);
		var c = new User.model();
		if(user._id)
			c._id = user._id;
		c.local.username = user.local.username;
		c.local.password = user.local.password;
		c.save(function(err) {
			if (err) console.log(err);
			console.log('Created user:' + c.id);
			callback();
		});
	});
}, function(err) {
	if (err) console.log(err);
	process.exit();
});