'use strict';
var lodash = require('lodash');
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
        TopService.findAll(function(err, tops) {
            if (err) {
                return res.json(err);
            }
            return res.json(tops);
        });
    };

    TopController.add = function(req, res) {
        TopService.findAll(function(err, tops) {
            if (err) {
                return res.json(err);
            }
            return res.json(tops);
        });
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
            TopService.checkExist(body.name,
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
                var top = new Top(body);
                top.save(function(err, top) {
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
        })

    }

    function update(req, res) {
        checkExist(req, res, function() {
            var body = req.body;
            if (body) {
                var id = body.id;
                delete body.id;
                Top.findOneAndUpdate({
                    _id: id
                }, body, function(err, doc) {
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

    function del(req, res) {
        var body = req.body;
        if (body) {
            var id = body.id;
            Top.remove({
                _id: id
            }, function(err) {
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