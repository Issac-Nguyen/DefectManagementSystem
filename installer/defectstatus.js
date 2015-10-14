'use strict';
var DefectStatus = require('../app/models/defectstatus'),
    async = require('async'),
    _ = require('lodash'),
    uuid = require('node-uuid'),
    settings = require('../app/config/environment'),
    mongoUri = settings.db.url,
    mongoose = require('mongoose').connect(mongoUri);


var defectstatuses = [{
    Name: 'New',
    Description: 'A new defect is created'
}, {
    Name: 'Acknowledged',
    Description: 'It has been acknowledged'
}, {
    Name: 'Contractor',
    Description: 'Defect can only be resolved for contractor'
}, {
    Name: 'WIP',
    Description: 'May wait for spare part. It cannot be solved immediately'
}, {
    Name: 'Resolved',
    Description: 'Defect is resolved'
}, {
    Name: 'Reopen',
    Description: 'Defect is reopen'
}, {
    Name: 'Resolved2',
    Description: 'Defect is resolved after re-open'
}];


async.each(defectstatuses, function(defectstatus, callback) {
    DefectStatus.model.remove({
        Name: defectstatus.Name
    }, function(err) {
        if (err) console.log(err);
        var c = new DefectStatus.model();
        if (defectstatus._id)
            c._id = defectstatus._id;
        c.Name = defectstatus.Name;
        c.Description = defectstatus.Description;
        c.save(function(err) {
            if (err) 
                return callback(err);
            console.log('Created DefectStatus:' + c.Name);
            callback();
        });
    });
}, function(err) {
    if (err) 
        return console.log(err);
    process.exit();
});