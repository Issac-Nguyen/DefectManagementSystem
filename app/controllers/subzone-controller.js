'use strict';
var lodash = require('lodash');
module.exports = function(app) {
    var SubZoneController = {};
    var SubZoneService = app.services.SubZone;

    SubZoneController.findBySubZoneID = function(req, res) {
        SubZoneService.findByID(req.params.Id, function(err, subzone) {
            if (err) {
                return res.json(err);
            }
            return res.json(subzone);
        });
    };

    SubZoneController.findAll = function(req, res) {
        SubZoneService.findAll(function(err, subzones) {
            if (err) {
                return res.json(err);
            }
            return res.json(subzones);
        });
    };

    SubZoneController.findByID = function(id, callback) {
        SubZoneService.findByID(id, callback);
    };

    SubZoneController.findAllWithCallback = function(callback) {
        SubZoneService.findAll(callback);
    }

	SubZoneController.findAllFromDateWithCallback = function(dateFrom, callback) {
        SubZoneService.findAllFromDate(dateFrom, callback);
    }

    SubZoneController.checkExist = function(req, res, cb) {
        var body = req.body;
        if (body) {
            SubZoneService.checkExist(body.name,
                body.id, function(err, subzone) {
                    if (err)
                        return res.json({
                            result: err
                        });
                    if (subzone != null)
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

    SubZoneController.add = function(req, res) {
        SubZoneController.checkExist(req, res, function() {
            var body = req.body;
            if (body) {
                console.log(body);
                SubZoneService.add(body, function(err, subzone) {
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

    SubZoneController.update = function(req, res) {
        SubZoneController.checkExist(req, res, function() {
            var body = req.body;
            if (body) {
                var id = body.id;
                delete body.id;
                SubZoneService.update(id, body, function(err, doc) {
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

    SubZoneController.delete = function(req, res) {
        var body = req.body;
        if (body) {
            var id = body.id;
            SubZoneService.delete(id, function(err) {
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

return SubZoneController;
};