'use strict';
var express = require('express'),
    APIRouter = express.Router(),
    _ = require('lodash'),
    GenericRouter = express.Router(),
    unless = require('express-unless'),
    jwt = require('jsonwebtoken'),
    multer = require('multer'),
    path = require('path'),
    fs = require('fs'),
    mime = require('mime'),
    async = require('async');
module.exports = function(app) {
    var BuildingController = require('../controllers/building-controller')(app),
        CategoryController = require('../controllers/category-controller')(app),
        SubCategoryController = require('../controllers/subcategory-controller')(app),
        DepartmentController = require('../controllers/department-controller')(app),
        SubDepartmentController = require('../controllers/subdepartment-controller')(app),
        FloorController = require('../controllers/floor-controller')(app),
        ZoneController = require('../controllers/zone-controller')(app),
        SubZoneController = require('../controllers/subzone-controller')(app),
        AuthenticationController = require('../controllers/auth-controller')(app),
        PublicUserController = require('../controllers/publicuser-controller')(app),
        DefectController = require('../controllers/defect-controller')(app),
        TechnicianController = require('../controllers/technician-controller')(app),
        secretJWT = app.environment.secretJWT;

    var authenAPIRequest = function(req, res, next) {
        console.log(req.originalUrl);
        var authorization = req.headers.authorization;
        if (authorization) {
            var token = authorization.split(' ')[1];
            if (token) {
                jwt.verify(token, secretJWT, function(err, decoded) {
                    if (err)
                        next(err);
                    req.decoded = decoded;
                    next();
                });
            }
        } else {
            next(new Error("Authenication"));
        }
    }

    authenAPIRequest.unless = unless;

    //Allow Origin Access Control for API
    app.all('*', function(req, res, next) {
        res.header('Access-Control-Allow-Credentials', true);
        res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
        res.header('Access-Control-Allow-Headers', 'x-prototype-version,x-requested-with,content-type,accept,Authorization');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        if ('OPTIONS' === req.method) {
            res.sendStatus(200);
        } else {
            next();
        }
    });

    app.use('/', GenericRouter);

    GenericRouter.get('/', function(req, res, next) {
        res.sendStatus(200);
    });

    GenericRouter.post('/login', AuthenticationController.login);
    // GenericRouter.get('/logout', AuthenticationController.logout);

    app.use('/api', APIRouter);

    // APIRouter.use(AuthenticationController.hasPermission);

    APIRouter.use(authenAPIRequest.unless({
        path: [/noauthen-.*/i, '/api/']
    }));

    // APIRouter.modelMapping = {};

    APIRouter.get('/', function(req, res, next) {

        res.sendStatus(200);
    });

    // user routes
    // 
    APIRouter.post('/noauthen-getTokenAndUpdateNotifi', function(req, res, next) {
        var bodyRequest = req.body;
        if (bodyRequest) {
            var UUID = bodyRequest.UUID;
            var tokenNotification = bodyRequest.tokenNotification;
            var authorization = req.headers.authorization;
            if (UUID) {
                var obj = {
                    UUID: UUID
                };
                PublicUserController.addNewUser(obj, function(err, user) {
                    if (err)
                        return next(err);
                    var token = jwt.sign({
                        UUID: UUID
                    }, secretJWT);



                    res.json({
                        token: token
                    });
                });

            } else if (authorization) {
                var token = authorization.split(' ')[1];
                console.log(token);
                if (token) {
                    jwt.verify(token, secretJWT, function(err, decoded) {
                        if (err)
                            next(err);
                        res.json(decoded);
                    });
                } else {
                    res.json({
                        result: 'Error'
                    });
                }
            } else {
                res.json({
                    result: 'Error'
                });
            }
        }
    });

    APIRouter.get('/noauthen-getInfomationInit', function(req, res, next) {
        async.parallel({
            building: function(callback) {
                BuildingController.findAllWithCallback(function(err, buildings) {
                    if (err)
                        return callback(err);
                    callback(null, buildings);
                });
            },
            category: function(callback) {
                CategoryController.findAllWithCallback(function(err, categorys) {
                    if (err)
                        return callback(err);
                    callback(null, categorys);
                });
            },
            subcategory: function(callback) {
                SubCategoryController.findAllWithCallback(function(err, subcategorys) {
                    if (err)
                        return callback(err);
                    callback(null, subcategorys);
                });
            },
            department: function(callback) {
                DepartmentController.findAllWithCallback(function(err, departments) {
                    if (err)
                        return callback(err);
                    callback(null, departments);
                });
            },
            subdepartment: function(callback) {
                SubDepartmentController.findAllWithCallback(function(err, subdepartments) {
                    if (err)
                        return callback(err);
                    callback(null, subdepartments);
                });
            },
            floor: function(callback) {
                FloorController.findAllWithCallback(function(err, floors) {
                    if (err)
                        return callback(err);
                    callback(null, floors);
                });
            },
            zone: function(callback) {
                ZoneController.findAllWithCallback(function(err, zones) {
                    if (err)
                        return callback(err);
                    callback(null, zones);
                });
            },
            subzone: function(callback) {
                SubZoneController.findAllWithCallback(function(err, subzones) {
                    if (err)
                        return callback(err);
                    callback(null, subzones);
                });
            },
            defect: function(callback) {
                SubZoneController.findAllWithCallback(function(err, subzones) {
                    if (err)
                        return callback(err);
                    callback(null, subzones);
                });
            },
        }, function(err, results) {
            if (err)
                next(err);
            res.json(results);
        });
    });

    APIRouter.post('/uploadDefect', function(req, res, next) {
        var UUID = req.decoded.UUID;
        PublicUserController.findByUUID(UUID, function(err, user) {
            if (err)
                return next(err);
            var objectID = user._id;
            var arrDefect = JSON.parse(req.body.data);
            async.map(arrDefect, function(item, cb) {
                console.log(item);
                item.CreatedBy = objectID;
                item.idDefect = item.id;
                DefectController.add(item, function(err, defect) {
                    if (err)
                        return cb(err);
                    cb(null, defect.idDefect.toString());
                });
            }, function(err, results) {
                if (err)
                    return next(err);
                console.log(results);
                res.json(results);
            })
        });



        // PublicUserController.addNewUser(req.body, function(err, user) {
        //     if(err)
        //         return next(err);
        //     console.log(user);
        //     res.json(user);
        // })

        // res.json({
        //     result: 'success'
        // });
    });

    APIRouter.post('/getStatusDefectFromTimestamp', function(req, res, next) {
        var UUID = req.decoded.UUID;
        var dateGet = req.body.timestamp;
        if (!dateGet)
            return res.sendStatus(500);
        dateGet = new Date(Number(dateGet));
        console.log(dateGet);
        PublicUserController.findByUUID(UUID, function(err, user) {
            if (err)
                return next(err);
            var objectID = user._id;
            async.parallel({
                building: function(callback) {
                    BuildingController.findAllFromDateWithCallback(dateGet, function(err, buildings) {
                        if (err)
                            return callback(err);
                        callback(null, buildings);
                    });
                },
                category: function(callback) {
                    CategoryController.findAllFromDateWithCallback(dateGet, function(err, categorys) {
                        if (err)
                            return callback(err);
                        callback(null, categorys);
                    });
                },
                subcategory: function(callback) {
                    SubCategoryController.findAllFromDateWithCallback(dateGet, function(err, subcategorys) {
                        if (err)
                            return callback(err);
                        callback(null, subcategorys);
                    });
                },
                department: function(callback) {
                    DepartmentController.findAllFromDateWithCallback(dateGet, function(err, departments) {
                        if (err)
                            return callback(err);
                        callback(null, departments);
                    });
                },
                subdepartment: function(callback) {
                    SubDepartmentController.findAllFromDateWithCallback(dateGet, function(err, subdepartments) {
                        if (err)
                            return callback(err);
                        callback(null, subdepartments);
                    });
                },
                floor: function(callback) {
                    FloorController.findAllFromDateWithCallback(dateGet, function(err, floors) {
                        if (err)
                            return callback(err);
                        callback(null, floors);
                    });
                },
                zone: function(callback) {
                    ZoneController.findAllFromDateWithCallback(dateGet, function(err, zones) {
                        if (err)
                            return callback(err);
                        callback(null, zones);
                    });
                },
                subzone: function(callback) {
                    SubZoneController.findAllFromDateWithCallback(dateGet, function(err, subzones) {
                        if (err)
                            return callback(err);
                        callback(null, subzones);
                    });
                },
                defect: function(callback) {
                    DefectController.findAllFromDateWithCallback(dateGet, function(err, defects) {
                        if (err)
                            return callback(err);
                        callback(null, defects);
                    });
                },
            }, function(err, results) {
                if (err)
                    next(err);
                res.json(results);
            });
        });

    });


    var storageDefectImg = multer.diskStorage({
        destination: './upload/defects/',
        filename: function(req, file, cb) {
            var UUID, username;
            if (req.decoded) {
                UUID = req.decoded.UUID;
                username = req.decoded.username;
            }
            var defectID = req.params.defectID;
            cb(null, defectID + '-' + file.originalname);
        }
    });

    var upload = multer({
        storage: storageDefectImg
    });

    var type = upload.single('fileDefect');


    APIRouter.post('/noauthen-uploadImageDefect', type, function(req, res, next) {

        /** When using the "single"
      data come in "req.file" regardless of the attribute "name". **/
        console.log(req.file);
        //   var tmp_path = req.file.path;


        //   /** The original name of the uploaded file
        // stored in the variable "originalname". **/
        //   var target_path = 'upload/defects' + req.file.originalname;

        //   /** A better way to copy the uploaded file. **/
        //   var src = fs.createReadStream(tmp_path);
        //   var dest = fs.createWriteStream(target_path);
        //   src.pipe(dest);
        //   src.on('end', function() {
        res.json({
            'result': 'success'
        });
        //   });
        //   src.on('error', function(err) {
        //       res.json(err);
        //   });

    });

    APIRouter.post('/uploadImageDefect', type, function(req, res, next) {

        /** When using the "single"
      data come in "req.file" regardless of the attribute "name". **/
        console.log(req.file);
        //   var tmp_path = req.file.path;


        //   /** The original name of the uploaded file
        // stored in the variable "originalname". **/
        //   var target_path = 'upload/defects' + req.file.originalname;

        //   /** A better way to copy the uploaded file. **/
        //   var src = fs.createReadStream(tmp_path);
        //   var dest = fs.createWriteStream(target_path);
        //   src.pipe(dest);
        //   src.on('end', function() {
        res.json({
            'result': 'success'
        });
        //   });
        //   src.on('error', function(err) {
        //       res.json(err);
        //   });

    });

    APIRouter.post('/noauthen-loginTechnicianAndUpdateNotifi', function(req, res, next) {
        var bodyRequest = req.body;
        var authorization = req.headers.authorization;
        var tokenNotification = bodyRequest.tokenNotification;
        if (authorization) {
            var token = authorization.split(' ')[1];
            if (token) {
                jwt.verify(token, secretJWT, function(err, decoded) {
                    if (err)
                        return next(err);
                    // res.json(decoded);
                    TechnicianController.findByUserName(decoded.username, function(err, technician) {
                        if (err)
                            return next(err);
                        TechnicianController.update(technician.id, {
                            TokenNotifi: tokenNotification
                        }, function(err, technician) {
                            if (err)
                                return next(err);
                            res.json({
                                result: 'success'
                            });
                        });
                    });
                });
            }
        } else {
            var UUID = bodyRequest.UUID;
            var tokenNotification = bodyRequest.tokenNotification;
            var username = bodyRequest.username;
            var password = bodyRequest.password;
            TechnicianController.login(username, password, function(err, technician) {
                if (err)
                    return next(err);
                // TechnicianController.update(username, tokenNotification, function(err, technician) {
                //     if (err)
                //         return next(err);
                //get token with sign username
                var token = jwt.sign({
                    username: technician.Username
                }, secretJWT);

                res.json({
                    token: token
                });
                // });
            });
        }
    });

    APIRouter.get('/noauthen-downloadImageResolve/:fileName', function(req, res, next) {
        console.log(req.params);
        var file = app.environment.root + '/upload/resolve/123-1439836397955.jpg';
        console.log(file);
        res.download(file);
    });
    //APIRouter.get('/users', UserController.findAll);
    // APIRouter.post('/users', UserController.create);
    // APIRouter.get('/users/:userId', UserController.find);
    // APIRouter.put('/users/:userId', UserController.update);
    // APIRouter.delete('/users/:userId', UserController.destroy);
    // APIRouter.post('/users/setgroups', UserController.setGroups);
    // APIRouter.modelMapping.users = 'User';

};