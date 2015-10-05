'use strict';
var lodash = require('lodash');
module.exports = function(app) {
	var CompanyService = {};

	CompanyService.findByID = function(Id, callback) {
		return app.models.Company.findOne({
			_id: Id
		}, callback);
	};

	CompanyService.findAll = function(callback) {
		return app.models.Company.find({
		}, callback);
	};

	CompanyService.findAllFromDate = function(dateFrom, cb) {
		return app.models.Company.find({UpdatedOn: {$gte: dateFrom}}, cb);
	}

	CompanyService.checkExist = function(name, id, cb) {
        return app.models.Company.findOne({
            name: name,
            _id: {
                $ne: id
            }
        }, cb);
    }

    CompanyService.add = function(obj, cb) {
        var Company = new app.models.Company(obj);
        Company.save(cb);
    }

    CompanyService.update = function(id, obj, cb) {
        return app.models.Company.findOneAndUpdate({
            _id: id
        }, obj, cb);
    }

    CompanyService.delete = function(id, cb) {
        return app.models.Company.remove({
            _id: id
        }, cb);
    }

	return {
		service: CompanyService,
		serviceName: 'Company'
	};
};