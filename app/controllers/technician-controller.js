'use strict';
var _ = require('lodash');
module.exports = function(app) {
    var TechnicianController = {};
    var TechnicianService = app.services.Technician;

    TechnicianController.findByUserName = function(username, callback) {
        TechnicianService.findByUserName(username, callback);
    };

    TechnicianController.findAll = function(req, res) {
        var params = req.query;
        delete params.access_token;
        if (!(_.isEmpty(params))) {
            TechnicianService.findAllWithParams(params, function(err, technicians) {
                if (err) {
                    return res.json(err);
                }
                return res.json(technicians);
            });
        } else {
            TechnicianService.findAll(function(err, technicians) {
                if (err) {
                    return res.json(err);
                }
                return res.json(technicians);
            });
        }
    };

    TechnicianController.login = function(username, password, cb) {
        TechnicianService.login(username, password, cb);
    }

    TechnicianController.update = function(id, object, cb) {
        TechnicianService.update(id, object, cb);
    }

    TechnicianController.find = function(condition, callback) {
        TechnicianService.find(condition, callback);
    }

    TechnicianController.checkExist = function(req, res, cb) {
        var body = req.body;
        if (body) {
            TechnicianService.checkExist(body.Name,
                body.id, function(err, category) {
                    if (err)
                        return res.json({
                            result: err
                        });
                    if (category != null)
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

    TechnicianController.add = function(req, res) {
        TechnicianService.checkExist(req, res, function() {
            var body = req.body;
            if (body) {
                console.log(body);
                TechnicianService.add(body, function(err, category) {
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

    TechnicianController.update = function(req, res) {
        TechnicianService.checkExist(req, res, function() {
            var body = req.body;
            if (body) {
                var id = body.id;
                delete body.id;
                TechnicianService.update(id, body, function(err, doc) {
                    if (err)
                        return res.json({
                            result: err
                        });
                    // console.log(doc);
                    res.json({
                        result: 'success'
                    });
                });
            } else {
                return res.send(500);
            }
        });
    }

    TechnicianController.delete = function(req, res) {
        var body = req.body;
        if (body) {
            var id = body.id;
            TechnicianService.delete(id, function(err) {
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



    return TechnicianController;
};