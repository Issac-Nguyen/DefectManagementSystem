'use strict';
var _ = require('lodash');
module.exports = function(app) {
    var ZoneController = {};
    var ZoneService = app.services.Zone;

    ZoneController.findByZoneID = function(req, res) {
        ZoneService.findByID(req.params.Id, function(err, zone) {
            if (err) {
                return res.json(err);
            }
            return res.json(zone);
        });
    };

    ZoneController.findAll = function(req, res) {
        var params = req.query;
        delete params.access_token;
        if (!(_.isEmpty(params))) {
            ZoneService.findAllWithParams(params, function(err, zones) {
                if (err) {
                    return res.json(err);
                }
                return res.json(zones);
            });
        } else {
            ZoneService.findAll(function(err, zones) {
                if (err) {
                    return res.json(err);
                }
                return res.json(zones);
            });
        }
    };

    ZoneController.findByID = function(id, callback) {
        ZoneService.findByID(id, callback);
    };

    ZoneController.findAllWithCallback = function(callback) {
        ZoneService.findAll(callback);
    };

    ZoneController.findAllFromDateWithCallback = function(dateFrom, callback) {
        ZoneService.findAllFromDate(dateFrom, callback);
    };

    ZoneController.checkExist = function(req, res, cb) {
        var body = req.body;
        if (body) {
            ZoneService.checkExist(body.Name,
                body.id, function(err, zone) {
                    if (err)
                        return res.json({
                            result: err
                        });
                    if (zone != null)
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

    ZoneController.add = function(req, res) {
        ZoneController.checkExist(req, res, function() {
            var body = req.body;
            if (body) {
                console.log(body);
                ZoneService.add(body, function(err, zone) {
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

    ZoneController.update = function(req, res) {
        ZoneController.checkExist(req, res, function() {
            var body = req.body;
            if (body) {
                var id = body.id;
                delete body.id;
                ZoneService.update(id, body, function(err, doc) {
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

    ZoneController.delete = function(req, res) {
        var body = req.body;
        if (body) {
            var id = body.id;
            ZoneService.delete(id, function(err) {
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

    return ZoneController;
};