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
		return app.models.SubDepartment.find({
		}, callback);
	};

	SubDepartmentService.findAllFromDate = function(dateFrom, callback) {
		return app.models.SubDepartment.find({
            UpdatedOn: {
                $gte: dateFrom
            }
        }, callback);
	};

	SubDepartmentService.checkExist = function(name, id, cb) {
        return app.models.SubDepartment.findOne({
            name: name,
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