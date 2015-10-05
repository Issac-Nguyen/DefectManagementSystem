'use strict';
var lodash = require('lodash');
module.exports = function(app) {
	var SubDepartmentController = {};
	var SubDepartmentService = app.services.SubDepartment;

	SubDepartmentController.findBySubDepartmentID = function(req, res) {
		SubDepartmentService.findByID(req.params.Id, function(err, subdepartment) {
			if (err) {
				return res.json(err);
			}
			return res.json(subdepartment);
		});
	};

    SubDepartmentController.findAll = function(req, res) {
        SubDepartmentService.findAll(function(err, subdepartments) {
            if (err) {
                return res.json(err);
            }
            return res.json(subdepartments);
        });
    };

	SubDepartmentController.findByID = function(id, callback) {
		SubDepartmentService.findByID(id, callback);
	};

	SubDepartmentController.findAllWithCallback = function(callback) {
		SubDepartmentService.findAll(callback);
	};

	SubDepartmentController.findAllFromDateWithCallback = function(dateFrom, callback) {
		SubDepartmentService.findAllFromDate(dateFrom, callback);
	};

	SubDepartmentController.checkExist = function(req, res, cb) {
        var body = req.body;
        if (body) {
            SubDepartmentService.checkExist(body.name,
                body.id, function(err, subdepartment) {
                    if (err)
                        return res.json({
                            result: err
                        });
                    if (subdepartment != null)
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

    SubDepartmentController.add = function(req, res) {
        SubDepartmentController.checkExist(req, res, function() {
            var body = req.body;
            if (body) {
                console.log(body);
                SubDepartmentService.add(body, function(err, subdepartment) {
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

    SubDepartmentController.update = function(req, res) {
        SubDepartmentController.checkExist(req, res, function() {
            var body = req.body;
            if (body) {
                var id = body.id;
                delete body.id;
                SubDepartmentService.update(id, body, function(err, doc) {
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

    SubDepartmentController.delete = function(req, res) {
        var body = req.body;
        if (body) {
            var id = body.id;
            SubDepartmentService.delete(id, function(err) {
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

	return SubDepartmentController;
};