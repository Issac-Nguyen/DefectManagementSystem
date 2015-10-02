'use strict';
var lodash = require('lodash');
module.exports = function(app) {
	var BuildingService = {};

	BuildingService.findByID = function(Id, callback) {
		return app.models.Building.findOne({
			_id: Id
		}, callback);
	};

	BuildingService.findAll = function(callback) {
		return app.models.Building.find({
		}, callback);
	};

	BuildingService.findAllFromDate = function(dateFrom, cb) {
		return app.models.Building.find({UpdatedOn: {$gte: dateFrom}}, cb);
	}

	BuildingService.checkExist = function(name, id, cb) {
        return app.models.Building.findOne({
            name: name,
            _id: {
                $ne: id
            }
        }, cb);
    }

    BuildingService.add = function(obj, cb) {
        var Building = new app.models.Building(obj);
        Building.save(cb);
    }

    BuildingService.update = function(id, obj, cb) {
        return app.models.Building.findOneAndUpdate({
            _id: id
        }, obj, cb);
    }

    BuildingService.delete = function(id, cb) {
        return app.models.Building.remove({
            _id: id
        }, cb);
    }

	return {
		service: BuildingService,
		serviceName: 'Building'
	};
};