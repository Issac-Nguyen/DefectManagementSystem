'use strict';
var SubCategory = require('../app/models/subcategory'),
	async = require('async'),
	_ = require('lodash'),
	fs = require('fs'),
	crypto = require('crypto'),
	uuid = require('node-uuid'),
	settings = require('../app/config/environment'),
	mongoUri = settings.db.url,
	mongoose = require('mongoose').connect(mongoUri);


var subcategorys = [{
	Name: 'SubCategory 1',
	CategoryID: mongoose.Types.ObjectId('55b887653a865464149b0a1d'),
	Description: 'Description of SubCategory 1'
}, {
	_id: mongoose.Types.ObjectId('55b887653a865464149b0a1e'),
	Name: 'SubCategory 2',
	CategoryID: mongoose.Types.ObjectId('55b887653a865464149b0a1e'),
	Description: 'Description of SubCategory 2'
}];


async.each(subcategorys, function(subcategory, callback) {
	SubCategory.model.remove({
		Name: subcategory.name
	}, function(err) {
		if (err) console.log(err);
		var c = new SubCategory.model();
		c.Name = subcategory.Name;
		c.CategoryID = subcategory.CategoryID;
		c.Description = subcategory.Description;
		c.save(function(err) {
			if (err) console.log(err);
			console.log('Created subcategory:' + c.Name);
			callback();
		});
	});
}, function(err) {
	if (err) console.log(err);
	process.exit();
});