'use strict';
var lodash = require('lodash');
module.exports = function(app) {
	var CompanyController = {};
	var CompanyService = app.services.Company;

	CompanyController.findByCompanyID = function(req, res) {
		CompanyService.findByID(req.params.Id, function(err, company) {
			if (err) {
				return res.json(err);
			}
			return res.json(company);
		});
	};

	CompanyController.findAll = function(req, res) {
		CompanyService.findAll(function(err, companies) {
			if (err) {
				return res.json(err);
			}
			return res.json(companies);
		});
	};


	CompanyController.findByID = function(id, callback) {
		CompanyService.findByID(id, callback);
	};

	CompanyController.findAllWithCallback = function(callback) {
		CompanyService.findAll(callback);
	};

	CompanyController.findAllFromDateWithCallback = function(dateFrom, callback) {
		CompanyService.findAllFromDate(dateFrom, callback);
	};

	CompanyController.checkExist = function(req, res, cb) {
        var body = req.body;
        if (body) {
            CompanyService.checkExist(body.name,
                body.id, function(err, company) {
                    if (err)
                        return res.json({
                            result: err
                        });
                    if (company != null)
                        return res.json({
                            result: 'existed'
                        });
                    if (cb)
                        cb();
                });
        } else {
            return res.send(500);
        }
    }

    CompanyController.add = function(req, res) {
        CompanyController.checkExist(req, res, function() {
            var body = req.body;
            if (body) {
                console.log(body);
                CompanyService.add(body, function(err, company) {
                    if (err)
                        return res.json({
                            result: err
                        });
                    res.json({
                        result: 'success'
                    });
                });
            } else {
                return res.send(500);
            }
        });
    }

    CompanyController.update = function(req, res) {
        CompanyController.checkExist(req, res, function() {
            var body = req.body;
            if (body) {
                var id = body.id;
                delete body.id;
                CompanyService.update(id, body, function(err, doc) {
                    if (err)
                        return res.json({
                            result: err
                        });
                    console.log(doc);
                    res.json({
                        result: 'success'
                    });
                });
            } else {
                return res.send(500);
            }
        });
    }

    CompanyController.delete = function(req, res) {
        var body = req.body;
        if (body) {
            var id = body.id;
            CompanyService.delete(id, function(err) {
                if (err)
                    return res.json({
                        result: err
                    });
                res.json({
                    result: 'success'
                });
            })
        } else {
            return res.send(500);
        }
    }

	return CompanyController;
};