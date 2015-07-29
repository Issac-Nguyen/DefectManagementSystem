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

	var _buildingNo = 1688;

	function getBuildingNo() {
		_buildingNo += 1;
		return _buildingNo;
	}

var buildings = [{
	_id: mongoose.Types.ObjectId('55b886ad6130e64413e2336f'),
	Name: 'Building 1',
	CompanyID: mongoose.Types.ObjectId('55b87dba0f20318c025fcf0e'),
	BuildingNo: _buildingNo,
	Address: 'address building 1',
}, {
	_id: mongoose.Types.ObjectId('55b886ad6130e64413e23370'),
	Name: 'Building 2',
	CompanyID: mongoose.Types.ObjectId('55b87dba0f20318c025fcf0f'),
	BuildingNo: getBuildingNo(),
	Address: 'address building 1',
}];


async.each(buildings, function(building, callback) {
	Building.model.remove({
		Name: building._id
	}, function(err) {
		if (err) console.log(err);
		var c = new Building.model();
		c.Name = building.Name;
		c.CompanyID = building.CompanyID;
		c.BuildingNo = building.BuildingNo;
		c.Address = building.Address;
		c.save(function(err) {
			if (err) console.log(err);
			console.log('Created building:' + c.Name);
			callback();
		});
	});
}, function(err) {
	if (err) console.log(err);
	process.exit();
});