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

    FloorService.findAllWithParams = function(params, callback) {
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
        var exe = app.models.Floor.find(objSearch);
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
            app.models.Floor.count(objSearch, function(err1, cnt) {
                if (err1)
                    return callback(err1);
                callback(null, {
                    items: categorys,
                    totalItems: cnt
                });
            })
        });
    };

	FloorService.findAllFromDate = function(dateFrom, callback) {
		return app.models.Floor.find({UpdatedOn: {$gte: dateFrom}}, callback);
	};

	FloorService.checkExist = function(name, id, cb) {
        return app.models.Floor.findOne({
            Name: name,
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
        obj.UpdatedOn = new Date();
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