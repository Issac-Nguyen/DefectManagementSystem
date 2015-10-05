'use strict';
var lodash = require('lodash');
module.exports = function(app) {
	var CategoryController = {};
	var CategoryService = app.services.Category;

	CategoryController.findByCategoryID = function(req, res) {
		CategoryService.findByID(req.params.Id, function(err, category) {
			if (err) {
				return res.json(err);
			}
			return res.json(category);
		});
	};

    CategoryController.findAll = function(req, res) {
        CategoryService.findAll(function(err, categorys) {
            if (err) {
                return res.json(err);
            }
            return res.json(categorys);
        });
    };

	CategoryController.findByID = function(id, callback) {
		CategoryService.findByID(id, callback);
	};

	CategoryController.findAllWithCallback = function(callback) {
		CategoryService.findAll(callback);
	};

	CategoryController.findAllFromDateWithCallback = function(dateFrom, callback) {
		CategoryService.findAllFromDate(dateFrom, callback);
	};

	CategoryController.checkExist = function(req, res, cb) {
        var body = req.body;
        if (body) {
            CategoryService.checkExist(body.name,
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

    CategoryController.add = function(req, res) {
        CategoryController.checkExist(req, res, function() {
            var body = req.body;
            if (body) {
                console.log(body);
                CategoryService.add(body, function(err, category) {
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

    CategoryController.update = function(req, res) {
        CategoryController.checkExist(req, res, function() {
            var body = req.body;
            if (body) {
                var id = body.id;
                delete body.id;
                CategoryService.update(id, body, function(err, doc) {
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

    CategoryController.delete = function(req, res) {
        var body = req.body;
        if (body) {
            var id = body.id;
            CategoryService.delete(id, function(err) {
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

	return CategoryController;
};