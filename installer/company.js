'use strict';
var Company = require('../app/models/company'),
	async = require('async'),
	_ = require('lodash'),
	fs = require('fs'),
	crypto = require('crypto'),
	uuid = require('node-uuid'),
	settings = require('../app/config/environment'),
	mongoUri = settings.db.url,
	mongoose = require('mongoose').connect(mongoUri);


var companys = [{
	Name: 'Company 1',
	Address: 'address company 1'
}, {
	Name: 'Company 2',
	Address: 'address company 2'
}];


async.each(companys, function(company, callback) {
	Company.model.remove({
		Name: company.name
	}, function(err) {
		if (err) console.log(err);
		var c = new Company.model();
		c.Name = company.Name;
		c.Address = company.Address;
		c.save(function(err) {
			if (err) console.log(err);
			console.log('Created company:' + c.Name);
			callback();
		});
	});
}, function(err) {
	if (err) console.log(err);
	process.exit();
});