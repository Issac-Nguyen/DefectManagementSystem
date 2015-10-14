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

    CompanyService.findAllWithParams = function(params, callback) {
        var sortStr = '';
        //search
        var objSearch = {};
        if (params.Name)
            objSearch.Name = new RegExp(params.Name);
        if (params.CompanyNo)
            objSearch.CompanyNo = params.CompanyNo;
        if (params.Address)
            objSearch.Address = new RegExp(params.Address);
        if (params.InCharge)
            objSearch.InCharge = new RegExp(params.InCharge);
        if (params.InChargeNo)
            objSearch.InChargeNo = params.InChargeNo;
        if (params.OrangeInDay)
            objSearch.OrangeInDay = params.OrangeInDay;
        if (params.RedInDay)
            objSearch.RedInDay = params.InChargeNo;
        if (params.MaxNoDefectPicture)
            objSearch.MaxNoDefectPicture = params.MaxNoDefectPicture;
        if (params.MaxNoResolvedPicture)
            objSearch.MaxNoResolvedPicture = params.MaxNoResolvedPicture;
        //end search
        var exe = app.models.Company.find(objSearch);
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
            app.models.Company.count(objSearch, function(err1, cnt) {
                if (err1)
                    return callback(err1);
                callback(null, {
                    items: categorys,
                    totalItems: cnt
                });
            })
        });
    };

	CompanyService.findAllFromDate = function(dateFrom, cb) {
		return app.models.Company.find({UpdatedOn: {$gte: dateFrom}}, cb);
	}

	CompanyService.checkExist = function(name, id, cb) {
        return app.models.Company.findOne({
            Name: name,
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
        obj.UpdatedOn = new Date();
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