'use strict';
var Technician = require('../app/models/technician'),
    async = require('async'),
    _ = require('lodash'),
    fs = require('fs'),
    crypto = require('crypto'),
    uuid = require('node-uuid'),
    settings = require('../app/config/environment'),
    mongoUri = settings.db.url,
    mongoose = require('mongoose').connect(mongoUri);


var technicians = [{
        BuildingID: mongoose.Types.ObjectId('55b886ad6130e64413e2336f'),
        CompanyID: mongoose.Types.ObjectId('55b87dba0f20318c025fcf0e'),
        Username: 'Technician1',
        password: '123'
    },
    {
        BuildingID: mongoose.Types.ObjectId('55b886ad6130e64413e23370'),
        CompanyID: mongoose.Types.ObjectId('55b87dba0f20318c025fcf0f'),
        Username: 'Technician2',
        password: '123'
    }
]


async.each(technicians, function(technician, callback) {
    Technician.model.remove({
        Username: technician.Username
    }, function(err) {
        if (err) console.log(err);
        var c = new Technician.model();
        c.Username = technician.Username;
        c.BuildingID = technician.BuildingID;
        c.CompanyID = technician.CompanyID;
        c.password = technician.password;
        c.save(function(err) {
            if (err) 
            	return callback(err);
            console.log('Created technician:' + c.Username);
            callback();
        });
        // c.validate(function(err) {
        // 	if(err)
        // 		callback(err);
        // });
    });
}, function(err) {
    if (err) console.log(err);
    process.exit();
});