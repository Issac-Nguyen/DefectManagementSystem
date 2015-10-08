'use strict';
var _ = require('lodash');
module.exports = function(app) {
    var BuildingController = {};
    var BuildingService = app.services.Building;

    BuildingController.findByBuildingID = function(req, res) {
        BuildingService.findByID(req.params.Id, function(err, building) {
            if (err) {
                return res.json(err);
            }
            return res.json(building);
        });
    };

    BuildingController.findAll = function(req, res) {
        var params = req.query;
        delete params.access_token;
        if (!(_.isEmpty(params))) {
            BuildingService.findAllWithParams(params, function(err, buildings) {
                if (err) {
                    return res.json(err);
                }
                return res.json(buildings);
            });
        } else {
            BuildingService.findAll(function(err, buildings) {
                if (err) {
                    return res.json(err);
                }
                return res.json(buildings);
            });
        }
    };


    BuildingController.findByID = function(id, callback) {
        BuildingService.findByID(id, callback);
    };

    BuildingController.findAllWithCallback = function(callback) {
        BuildingService.findAll(callback);
    };

    BuildingController.findAllFromDateWithCallback = function(dateFrom, callback) {
        BuildingService.findAllFromDate(dateFrom, callback);
    };

    BuildingController.checkExist = function(req, res, cb) {
        var body = req.body;
        if (body) {
            BuildingService.checkExist(body.Name,
                body.id, function(err, building) {
                    if (err)
                        return res.json({
                            result: err
                        });
                    if (building != null)
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

    BuildingController.add = function(req, res) {
        BuildingController.checkExist(req, res, function() {
            var body = req.body;
            if (body) {
                console.log(body);
                BuildingService.add(body, function(err, building) {
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

    BuildingController.update = function(req, res) {
        BuildingController.checkExist(req, res, function() {
            var body = req.body;
            if (body) {
                var id = body.id;
                delete body.id;
                BuildingService.update(id, body, function(err, doc) {
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

    BuildingController.delete = function(req, res) {
        var body = req.body;
        if (body) {
            var id = body.id;
            BuildingService.delete(id, function(err) {
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

    return BuildingController;
};