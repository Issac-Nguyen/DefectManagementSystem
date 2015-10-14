'use strict';
var lodash = require('lodash');
module.exports = function(app) {
    var SubDepartmentService = {};

    SubDepartmentService.findByID = function(Id, callback) {
        return app.models.SubDepartment.findOne({
            _id: Id
        }, callback);
    };

    SubDepartmentService.findAll = function(callback) {
        return app.models.SubDepartment.find({}, callback);
    };

    SubDepartmentService.findAllWithParams = function(params, callback) {
        var sortStr = '';
        //search
        var objSearch = {};
        if (params.Name)
            objSearch.Name = new RegExp(params.Name);
        if (params.Description)
            objSearch.Description = new RegExp(params.Description);
        if (params.DepartmentID)
            objSearch.DepartmentID = new RegExp(params.DepartmentID);
        //end search
        var exe = app.models.SubDepartment.find(objSearch);
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
        return exe.exec(function(err, categorys) {
            if (err)
                return callback(err);
            app.models.SubDepartment.count(objSearch, function(err1, cnt) {
                if (err1)
                    return callback(err1);
                callback(null, {
                    items: categorys,
                    totalItems: cnt
                });
            })
        });
    }

    SubDepartmentService.findAllFromDate = function(dateFrom, callback) {
        return app.models.SubDepartment.find({
            UpdatedOn: {
                $gte: dateFrom
            }
        }, callback);
    };

    SubDepartmentService.checkExist = function(name, id, cb) {
        return app.models.SubDepartment.findOne({
            Name: name,
            _id: {
                $ne: id
            }
        }, cb);
    }

    SubDepartmentService.add = function(obj, cb) {
        var SubDepartment = new app.models.SubDepartment(obj);
        SubDepartment.save(cb);
    }

    SubDepartmentService.update = function(id, obj, cb) {
        obj.UpdatedOn = new Date();
        return app.models.SubDepartment.findOneAndUpdate({
            _id: id
        }, obj, cb);
    }

    SubDepartmentService.delete = function(id, cb) {
        return app.models.SubDepartment.remove({
            _id: id
        }, cb);
    }

    return {
        service: SubDepartmentService,
        serviceName: 'SubDepartment'
    };
};