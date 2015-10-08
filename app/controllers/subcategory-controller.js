'use strict';
var _ = require('lodash');
module.exports = function(app) {
	var SubCategoryController = {};
	var SubCategoryService = app.services.SubCategory;

	SubCategoryController.findBySubCategoryID = function(req, res) {
		SubCategoryService.findByID(req.params.Id, function(err, subcategory) {
			if (err) {
				return res.json(err);
			}
			return res.json(subcategory);
		});
	};

    SubCategoryController.findAll = function(req, res) {
         var params = req.query;
         delete params.access_token;
       if (!(_.isEmpty(params))) {
            SubCategoryService.findAllWithParams(params, function(err, subcategorys) {
                if (err) {
                    return res.json(err);
                }
                return res.json(subcategorys);
            });
        } else {
            SubCategoryService.findAll(function(err, subcategorys) {
                if (err) {
                    return res.json(err);
                }
                return res.json(subcategorys);
            });
        }
    };

	SubCategoryController.findByID = function(id, callback) {
		SubCategoryService.findByID(id, callback);
	};

	SubCategoryController.findAllWithCallback = function(callback) {
		SubCategoryService.findAll(callback);
	};

	SubCategoryController.findAllFromDateWithCallback = function(dateFrom, callback) {
		SubCategoryService.findAllFromDate(dateFrom, callback);
	};

	SubCategoryController.checkExist = function(req, res, cb) {
        var body = req.body;
        if (body) {
            SubCategoryService.checkExist(body.Name,
                body.id, function(err, subcategory) {
                    if (err)
                        return res.json({
                            result: err
                        });
                    if (subcategory != null)
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

    SubCategoryController.add = function(req, res) {
        SubCategoryController.checkExist(req, res, function() {
            var body = req.body;
            if (body) {
                console.log(body);
                SubCategoryService.add(body, function(err, subcategory) {
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

    SubCategoryController.update = function(req, res) {
        SubCategoryController.checkExist(req, res, function() {
            var body = req.body;
            if (body) {
                var id = body.id;
                delete body.id;
                SubCategoryService.update(id, body, function(err, doc) {
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

    SubCategoryController.delete = function(req, res) {
        var body = req.body;
        if (body) {
            var id = body.id;
            SubCategoryService.delete(id, function(err) {
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

	return SubCategoryController;
};