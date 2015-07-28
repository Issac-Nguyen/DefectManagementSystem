'use strict';
var Building = require('../app/models/building'),
	async = require('async'),
	_ = require('lodash'),
	fs = require('fs'),
	crypto = require('crypto'),
	uuid = require('node-uuid'),
	settings = require('../app/config/environment'),
	mongoUri = settings.db.url,
	mongoose = require('mongoose').connect(mongoUri);

var defaultPass = '1234';
var defaultSalt = '';
var md5 = function(value) {
	return crypto.createHash('md5').update(value).digest('hex');
};

var encryptPassword = function(password, salt) {
	salt = salt || '';
	return md5(md5(password) + salt);
};

var buildings = [{
	Name: 'Building1',
	
}, ];


async.each(users, function(user, callback) {
	User.model.remove({
		username: user.username
	}, function(err) {
		if (err) console.log(err);
		var u = new User.model();
		u.username = user.username;
		u.email = user.email;
		u.password = '1234';
		u.save(function(err) {
			if (err) console.log(err);
			console.log('Created user:' + u.username);
			callback();
		});
	});
}, function(err) {
	if (err) console.log(err);
	process.exit();
});