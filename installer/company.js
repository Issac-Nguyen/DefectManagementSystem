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
    _id: mongoose.Types.ObjectId("55b87dba0f20318c025fcf0e"),
    Name: 'Company 1',
    Address: 'address company 1'
}, {
    _id: mongoose.Types.ObjectId("55b87dba0f20318c025fcf0f"),
    Name: 'Company 2',
    Address: 'address company 2'
}];


async.each(companys, function(company, callback) {
    Company.model.remove({
        _id: company._id
    }, function(err) {
        if (err) console.log(err);
        var c = new Company.model();
        if (company._id)
            c._id = company._id;
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