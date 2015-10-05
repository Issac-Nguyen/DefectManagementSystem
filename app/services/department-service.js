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

	DepartmentService.findAllFromDate = function(dateFrom, callback) {
		return app.models.Department.find({UpdatedOn: {$gte: dateFrom}}, callback);
	};

	DepartmentService.checkExist = function(name, id, cb) {
        return app.models.Department.findOne({
            name: name,
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