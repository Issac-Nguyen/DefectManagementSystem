'use strict';
var lodash = require('lodash');
module.exports = function(app) {
	var FloorService = {};

	FloorService.findByID = function(Id, callback) {
		return app.models.Floor.findOne({
			_id: Id
		}, callback);
	};

	FloorService.findAll = function(callback) {
		return app.models.Floor.find(callback);
	};

	FloorService.findAllFromDate = function(dateFrom, callback) {
		return app.models.Floor.find({UpdatedOn: {$gte: dateFrom}}, callback);
	};

	FloorService.checkExist = function(name, id, cb) {
        return app.models.Floor.findOne({
            name: name,
            _id: {
                $ne: id
            }
        }, cb);
    }

    FloorService.add = function(obj, cb) {
        var Floor = new app.models.Floor(obj);
        Floor.save(cb);
    }

    FloorService.update = function(id, obj, cb) {
        return app.models.Floor.findOneAndUpdate({
            _id: id
        }, obj, cb);
    }

    FloorService.delete = function(id, cb) {
        return app.models.Floor.remove({
            _id: id
        }, cb);
    }

	return {
		service: FloorService,
		serviceName: 'Floor'
	};
};