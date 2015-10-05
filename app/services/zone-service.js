'use strict';
var lodash = require('lodash');
module.exports = function(app) {
	var ZoneService = {};

	ZoneService.findByID = function(Id, callback) {
		return app.models.Zone.findOne({
			_id: Id
		}, callback);
	};

	ZoneService.findAll = function(callback) {
		return app.models.Zone.find({
		}, callback);
	};

	ZoneService.findAllFromDate = function(dateFrom, callback) {
		return app.models.Zone.find({UpdatedOn: {$gte: dateFrom}}, callback);
	};

	ZoneService.checkExist = function(name, id, cb) {
        return app.models.Zone.findOne({
            name: name,
            _id: {
                $ne: id
            }
        }, cb);
    }

    ZoneService.add = function(obj, cb) {
        var Zone = new app.models.Zone(obj);
        Zone.save(cb);
    }

    ZoneService.update = function(id, obj, cb) {
        return app.models.Zone.findOneAndUpdate({
            _id: id
        }, obj, cb);
    }

    ZoneService.delete = function(id, cb) {
        return app.models.Zone.remove({
            _id: id
        }, cb);
    }

	return {
		service: ZoneService,
		serviceName: 'Zone'
	};
};