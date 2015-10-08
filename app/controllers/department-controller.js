'use strict';
var _ = require('lodash');
module.exports = function(app) {
    var DepartmentController = {};
    var DepartmentService = app.services.Department;

    DepartmentController.findByDepartmentID = function(req, res) {
        DepartmentService.findByID(req.params.Id, function(err, department) {
            if (err) {
                return res.json(err);
            }
            return res.json(department);
        });
    };

    DepartmentController.findAll = function(req, res) {
        var params = req.query;
        delete params.access_token;
        if (!(_.isEmpty(params))) {
            DepartmentService.findAllWithParams(params, function(err, departments) {
                if (err) {
                    return res.json(err);
                }
                return res.json(departments);
            });
        } else {
            DepartmentService.findAll(function(err, departments) {
                if (err) {
                    return res.json(err);
                }
                return res.json(departments);
            });
        }
    };

    DepartmentController.findByID = function(id, callback) {
        DepartmentService.findByID(id, callback);
    };

    DepartmentController.findAllWithCallback = function(callback) {
        DepartmentService.findAll(callback);
    };

    DepartmentController.findAllFromDateWithCallback = function(dateFrom, callback) {
        DepartmentService.findAllFromDate(dateFrom, callback);
    };

    DepartmentController.checkExist = function(req, res, cb) {
        var body = req.body;
        if (body) {
            DepartmentService.checkExist(body.Name,
                body.id, function(err, department) {
                    if (err)
                        return res.json({
                            result: err
                        });
                    if (department != null)
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

    DepartmentController.add = function(req, res) {
        DepartmentController.checkExist(req, res, function() {
            var body = req.body;
            if (body) {
                console.log(body);
                DepartmentService.add(body, function(err, department) {
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

    DepartmentController.update = function(req, res) {
        DepartmentController.checkExist(req, res, function() {
            var body = req.body;
            if (body) {
                var id = body.id;
                delete body.id;
                DepartmentService.update(id, body, function(err, doc) {
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

    DepartmentController.delete = function(req, res) {
        var body = req.body;
        if (body) {
            var id = body.id;
            DepartmentService.delete(id, function(err) {
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

    return DepartmentController;
};