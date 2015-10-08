'use strict';
var _ = require('lodash');
module.exports = function(app) {
    var TopController = {};
    var TopService = app.services.Top;



    TopController.findByTopID = function(req, res) {
        TopService.findByID(req.params.Id, function(err, building) {
            if (err) {
                return res.json(err);
            }
            return res.json(building);
        });
    };

    TopController.findAll = function(req, res) {
        var params = req.query;
        delete params.access_token;
        if (!(_.isEmpty(params))) {
            TopService.findAllWithParams(params, function(err, tops) {
                if (err) {
                    return res.json(err);
                }
                return res.json(tops);
            });
        } else {
            TopService.findAll(function(err, tops) {
                if (err) {
                    return res.json(err);
                }
                return res.json(tops);
            });
        }
    };


    TopController.findByID = function(id, callback) {
        TopService.findByID(id, callback);
    };
 
    TopController.findByName = function(name, callback) {
        TopService.findByName(name, callback);
    }

    TopController.findAllWithCallback = function(callback) {
        TopService.findAll(callback);
    };

    TopController.findAllFromDateWithCallback = function(dateFrom, callback) {
        TopService.findAllFromDate(dateFrom, callback);
    };

    TopController.checkExist = function(req, res, cb) {
        var body = req.body;
        if (body) {
            TopService.checkExist(body.Name,
                body.id, function(err, top) {
                    if (err)
                        return res.json({
                            result: err
                        });
                    if (top != null)
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

    TopController.add = function(req, res) {
        TopController.checkExist(req, res, function() {
            var body = req.body;
            if (body) {
                console.log(body);
                TopService.add(body, function(err, top) {
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

    TopController.update = function(req, res) {
        TopController.checkExist(req, res, function() {
            var body = req.body;
            if (body) {
                var id = body.id;
                delete body.id;
                TopService.update(id, body, function(err, doc) {
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

    TopController.delete = function(req, res) {
        var body = req.body;
        if (body) {
            var id = body.id;
            TopService.delete(id, function(err) {
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

    return TopController;
};