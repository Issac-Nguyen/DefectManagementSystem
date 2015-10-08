'use strict';
var Category = require('../app/models/category'),
    async = require('async'),
    _ = require('lodash'),
    fs = require('fs'),
    crypto = require('crypto'),
    uuid = require('node-uuid'),
    settings = require('../app/config/environment'),
    mongoUri = settings.db.url,
    mongoose = require('mongoose').connect(mongoUri);


var categorys = [{
    _id: mongoose.Types.ObjectId('55b887653a865464149b0a1d'),
    Name: 'Category 1',
    BuildingID: mongoose.Types.ObjectId('55b886ad6130e64413e2336f'),
    CompanyID: mongoose.Types.ObjectId('55b87dba0f20318c025fcf0e'),
    Description: 'Description of Category 1'
}, {
    _id: mongoose.Types.ObjectId('55b887653a865464149b0a1e'),
    Name: 'Category 2',
    BuildingID: mongoose.Types.ObjectId('55b886ad6130e64413e23370'),
    CompanyID: mongoose.Types.ObjectId('55b87dba0f20318c025fcf0f'),
    Description: 'Description of Category 2'
}];


async.each(categorys, function(category, callback) {
    Category.model.remove({
        _id: category._id
    }, function(err) {
        if (err) console.log(err);
        var c = new Category.model();
        if (category._id)
            c._id = category._id;
        c.Name = category.Name;
        c.CompanyID = category.CompanyID;
        c.BuildingID = category.BuildingID;
        c.Description = category.Description;
        c.save(function(err) {
            if (err) console.log(err);
            console.log('Created category:' + c.Name);
            callback();
        });
    });
}, function(err) {
    if (err) console.log(err);
    process.exit();
});