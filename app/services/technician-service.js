'use strict';
var lodash = require('lodash');
module.exports = function(app) {
    var TechnicianService = {};

    TechnicianService.findByUserName = function(username, callback) {
        return app.models.Technician.findOne({
            Username: username
        }, callback);
    };

    TechnicianService.findAllWithParams = function(params, callback) {
        var sortStr = '';
        //search
        var objSearch = {};
        if (params.Username)
            objSearch.Username = new RegExp(params.Username);
        if (params.Email)
            objSearch.Email = new RegExp(params.Email);
        if (params.ContactNo)
            objSearch.ContactNo = new RegExp(params.ContactNo);
        if (params.CategoryList)
            objSearch.CategoryList = new RegExp(params.CategoryList);
        if (params.BuildingList)
            objSearch.BuildingList = new RegExp(params.BuildingList);
        //end search
        var exe = app.models.Technician.find(objSearch);
        //sort
        if (params.sortType && params.sortKey) {
            sortStr = params.sortType == 'ASC' ? params.sortKey : '-' + params.sortKey;
        }
        sortStr = sortStr + ' -UpdatedOn';
        exe.sort(sortStr);
        //end sort
        //page
        if (params.pageSize)
            exe.limit(params.pageSize);
        if (params.pageNumber)
            exe.skip((params.pageNumber - 1) * params.pageSize)
            //end page
        return exe.exec(function(err, technicians) {
            if (err)
                return callback(err);
            app.models.Technician.count(objSearch, function(err1, cnt) {
                if (err1)
                    return callback(err1);
                callback(null, {
                    items: technicians,
                    totalItems: cnt
                });
            })
        });
    };

    TechnicianService.update = function(id, object, callback) {
        return app.models.Technician.update({
            _id: id
        }, {
            $set: object
        }, callback);
    };

    TechnicianService.login = function(username, password, callback) {
        app.models.Technician.findOne({
            Username: username
        }, function(err, technician) {
            if (err)
                return callback(err);
            if (technician) {
                if (technician.checkPassword(password)) {
                    callback(null, technician);
                } else {
                    callback(new Error('authentication fail'));
                }
            } else {
                callback(new Error('Not Found any Technician!'));
            }
        });
    }

    TechnicianService.checkExist = function(username, id, cb) {
        return app.models.Technician.findOne({
            Username: username,
            _id: {
                $ne: id
            }
        }, cb);
    }

    TechnicianService.add = function(obj, cb) {
        var Technician = new app.models.Technician(obj);
        Technician.save(cb);
    }

    // CategoryService.update = function(id, obj, cb) {
    //     obj.UpdatedOn = new Date();
    //     return app.models.Category.findOneAndUpdate({
    //         _id: id
    //     }, obj, cb);
    // }

    TechnicianService.delete = function(id, cb) {
        return app.models.Technician.remove({
            _id: id
        }, cb);
    }

    return {
        service: TechnicianService,
        serviceName: 'Technician'
    };
};