'use strict';
var _ = require('lodash');
module.exports = function(app) {
    var FloorController = {};
    var FloorService = app.services.Floor;

    FloorController.findByFloorID = function(req, res) {
        FloorService.findByID(req.params.Id, function(err, floor) {
            if (err) {
                return res.json(err);
            }
            return res.json(floor);
        });
    };

    FloorController.findAll = function(req, res) {
        var params = req.query;
        delete params.access_token;
        if (!(_.isEmpty(params))) {
            FloorService.findAllWithParams(params, function(err, floors) {
                if (err) {
                    return res.json(err);
                }
                return res.json(floors);
            });
        } else {
            FloorService.findAll(function(err, floors) {
                if (err) {
                    return res.json(err);
                }
                return res.json(floors);
            });
        }
    };

    FloorController.findByID = function(id, callback) {
        FloorService.findByID(id, callback);
    };

    FloorController.findAllWithCallback = function(callback) {
        FloorService.findAll(callback);
    };

    FloorController.findAllFromDateWithCallback = function(dateFrom, callback) {
        FloorService.findAllFromDate(dateFrom, callback);
    };

    FloorController.checkExist = function(req, res, cb) {
        var body = req.body;
        if (body) {
            FloorService.checkExist(body.Name,
                body.id, function(err, floor) {
                    if (err)
                        return res.json({
                            result: err
                        });
                    if (floor != null)
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

    FloorController.add = function(req, res) {
        FloorController.checkExist(req, res, function() {
            var body = req.body;
            if (body) {
                console.log(body);
                FloorService.add(body, function(err, floor) {
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

    FloorController.update = function(req, res) {
        FloorController.checkExist(req, res, function() {
            var body = req.body;
            if (body) {
                var id = body.id;
                delete body.id;
                FloorService.update(id, body, function(err, doc) {
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

    FloorController.delete = function(req, res) {
        var body = req.body;
        if (body) {
            var id = body.id;
            FloorService.delete(id, function(err) {
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

    return FloorController;
};