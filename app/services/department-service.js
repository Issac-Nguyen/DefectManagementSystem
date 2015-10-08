'use strict';
var lodash = require('lodash');
module.exports = function(app) {
	var DepartmentService = {};

	DepartmentService.findByID = function(Id, callback) {
		return app.models.Department.findOne({
			_id: Id
		}, callback);
	};

	DepartmentService.findAll = function(callback) {
		return app.models.Department.find(callback);
	};

    DepartmentService.findAllWithParams = function(params, callback) {
        var sortStr = '';
        //search
        var objSearch = {};
        if (params.Name)
            objSearch.Name = new RegExp(params.Name);
        if (params.Description)
            objSearch.Description = new RegExp(params.Description);
        if (params.BuildingID)
            objSearch.BuildingID = new RegExp(params.BuildingID);
        //end search
        var exe = app.models.Department.find(objSearch);
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
            app.models.Department.count(objSearch, function(err1, cnt) {
                if (err1)
                    return callback(err1);
                callback(null, {
                    items: categorys,
                    totalItems: cnt
                });
            })
        });
        // return app.models.Category.find(callback);
    };

	DepartmentService.findAllFromDate = function(dateFrom, callback) {
		return app.models.Department.find({UpdatedOn: {$gte: dateFrom}}, callback);
	};

	DepartmentService.checkExist = function(name, id, cb) {
        return app.models.Department.findOne({
            Name: name,
            _id: {
                $ne: id
            }
        }, cb);
    }

    DepartmentService.add = function(obj, cb) {
        var Department = new app.models.Department(obj);
        Department.save(cb);
    }

    DepartmentService.update = function(id, obj, cb) {
        obj.UpdatedOn = new Date();
        return app.models.Department.findOneAndUpdate({
            _id: id
        }, obj, cb);
    }

    DepartmentService.delete = function(id, cb) {
        return app.models.Department.remove({
            _id: id
        }, cb);
    }

	return {
		service: DepartmentService,
		serviceName: 'Department'
	};
};