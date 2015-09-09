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
        NotificationController = require('../controllers/notification-controller')(app),
        TopController = require('../controllers/top-controller')(app),
        CompanyController = require('../controllers/company-controller')(app),
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

        var authorization = req.headers.authorization;
        if (authorization) {
            var token = authorization.split(' ')[1];
            console.log(token);
            if (token) {
                jwt.verify(token, secretJWT, function(err, decoded) {
                    if (err)
                        return next(err);
                    upsertPulicUser(req, res, false);
                });
            } else {
                res.json({
                    result: 'Error'
                });
            }
        } else {
            upsertPulicUser(req, res, true);
        }

        function upsertPulicUser(req, res, send) {
            var bodyRequest = req.body;
            if (bodyRequest) {
                var UUID = bodyRequest.UUID;
                var tokenNotification = bodyRequest.tokenNotification;
                var platform = bodyRequest.platform
                if (UUID) {
                    var obj = {
                        UUID: UUID,
                        TokenNotifi: tokenNotification,
                        Platform: platform
                    };
                    PublicUserController.addNewUser(obj, function(err, user) {
                        if (err)
                            return next(err);
                        if (send) {
                            var token = jwt.sign({
                                UUID: UUID
                            }, secretJWT);

                            res.json({
                                token: token
                            });
                        } else {
                            res.json({
                                result: 'success'
                            })
                        }

                    });

                }
            }
        }
    });

    APIRouter.get('/noauthen-getInfomationInit', function(req, res, next) {
        async.parallel({
            top: function(callback) {
                TopController.findAllWithCallback(function(err, tops) {
                    if (err)
                        return callback(err);
                    callback(null, tops);
                });
            },
            company: function(callback) {
                CompanyController.findAllWithCallback(function(err, companies) {
                    if (err)
                        return callback(err);
                    callback(null, companies);
                });
            },
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
                        return cb(null, '');
                    //Send notification
                    var buildingID = defect.BuildingID;
                    var categoryID = defect.CategoryID;
                    var condition = {
                        BuildingList: {
                            "$in": [buildingID]
                        },
                        CategoryList: {
                            "$in": [categoryID]
                        }
                    };
                    TechnicianController.find(condition, function(err, technicians) {
                        if (err)
                            return next(err);
                        console.log(technicians);
                        //Update SentTechnicianList of defect
                        var arrTechnician = [];
                        for (var i = 0; i < technicians.length; i++) {
                            arrTechnician.push('/' + technicians.Username + '/');
                        }
                        var condition = {
                            _id: defect.id
                        };
                        var objSet = {
                            SentTechnicianList: arrTechnician
                        };
                        DefectController.updateWithCallback(condition, objSet, function() {});
                        for (var i = 0; i < technicians.length; i++) {
                            var technician = technicians[i];
                            NotificationController.sendNotification(technician.Platform, "Technician", technician.TokenNotifi, {
                                alert: "You have new Defect",
                                // payload: {
                                //     'messageFrom': Date.now().toString()
                                // }
                            });
                        }
                    });
                    cb(null, defect.idDefect.toString());
                });
            }, function(err, results) {
                if (err)
                    return next(err);
                // console.log(results);

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
            if (user == null)
                return res.json({
                    result: 'Not Found'
                });
            var objectID = user._id;
            async.parallel({
                top: function(callback) {
                    TopController.findAllFromDateWithCallback(dateGet, function(err, tops) {
                        if (err)
                            return callback(err);
                        callback(null, tops);
                    });
                },
                company: function(callback) {
                    CompanyController.findAllFromDateWithCallback(dateGet, function(err, companies) {
                        if (err)
                            return callback(err);
                        callback(null, companies);
                    });
                },
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

    APIRouter.post('/getInfoFromTimestampOfTechnician', function(req, res, next) {
        var username = req.decoded.username;
        var dateGet = req.body.timestamp;
        var UUID = req.body.UUID;
        if (!dateGet)
            return res.sendStatus(500);
        dateGet = new Date(Number(dateGet));
        console.log(dateGet);
        TechnicianController.findByUserName(username, function(err, user) {
            if (err)
                return next(err);
            // console.log(user);
            if (user == null)
                return res.json({
                    result: 'Not Found'
                });

            if (user.UUID != UUID) {
                console.log(UUID);
                console.log('user: ' + user.UUID);
                return res.json({
                    technician: {
                        logout: true
                    }
                })
            }
            var BuildingList = user.BuildingList;
            var CategoryList = user.CategoryList;
            var objectID = user._id;
            async.parallel({
                top: function(callback) {
                    TopController.findAllFromDateWithCallback(dateGet, function(err, tops) {
                        if (err)
                            return callback(err);
                        callback(null, tops);
                    });
                },
                company: function(callback) {
                    CompanyController.findAllFromDateWithCallback(dateGet, function(err, companies) {
                        if (err)
                            return callback(err);
                        callback(null, companies);
                    });
                },
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
                    DefectController.findAllFromDateAndRelateTechnicianWithCallback(dateGet, BuildingList, CategoryList, function(err, defects) {
                        if (err)
                            return callback(err);
                        callback(null, defects);
                    });
                },
            }, function(err, results) {
                if (err)
                    next(err);
                getFullDefect(results.defect, function(err, arrDefect) {
                    if (err)
                        return next(err);
                    results.defect = arrDefect;
                    // console.log(results.defect);
                    res.json(results);
                });
                // res.json(results);
            });
        });
    });

    function getFullDefect(arrDefect, callback) {
        var arrDefectResult = [];
        if (arrDefect.length == 0)
            return callback(null, arrDefect);
        async.each(arrDefect, function(defect, cb1) {
            async.parallel({
                BuildingName: function(cb) {
                    BuildingController.findByID(defect.BuildingID, function(err, building) {
                        if (err)
                            return cb(err);
                        cb(null, building.Name);
                    });
                },
                CategoryName: function(cb) {
                    CategoryController.findByID(defect.CategoryID, function(err, category) {
                        if (err)
                            return cb(err);
                        cb(null, category.Name);
                    });
                },
                SubCategoryName: function(cb) {
                    SubCategoryController.findByID(defect.SubCategoryID, function(err, subcategory) {
                        if (err)
                            return cb(err);
                        cb(null, subcategory.Name);
                    });
                },
                DepartmentName: function(cb) {
                    DepartmentController.findByID(defect.DepartmentID, function(err, department) {
                        if (err)
                            return cb(err);
                        cb(null, department.Name);
                    });
                },
                SubDepartmentName: function(cb) {
                    SubDepartmentController.findByID(defect.SubDepartmentID, function(err, department) {
                        if (err)
                            return cb(err);
                        cb(null, department.Name);
                    });
                },
                ZoneName: function(cb) {
                    ZoneController.findByID(defect.ZoneID, function(err, zone) {
                        if (err)
                            return cb(err);
                        cb(null, zone.Name);
                    });
                },
                SubZoneName: function(cb) {
                    SubZoneController.findByID(defect.SubZoneID, function(err, subzone) {
                        if (err)
                            return cb(err);
                        cb(null, subzone.Name);
                    });
                },
                FloorName: function(cb) {
                    FloorController.findByID(defect.FloorID, function(err, floor) {
                        if (err)
                            return cb(err);
                        cb(null, floor.Name);
                    });
                }
            }, function(err, results) {
                if (err)
                    return cb1(err);
                // console.log(results);
                var defectNew = {};
                defectNew.BuildingID = defect.BuildingID;
                defectNew.BuildingName = results.BuildingName;
                defectNew.CategoryID = defect.CategoryID;
                defectNew.CategoryName = results.CategoryName;
                defectNew.DepartmentID = defect.DepartmentID;
                defectNew.DepartmentName = results.DepartmentName;
                defectNew.SubCategoryID = defect.SubCategoryID;
                defectNew.SubCategoryName = results.SubCategoryName;
                defectNew.SubDepartmentID = defect.SubDepartmentID;
                defectNew.SubDepartmentName = results.SubDepartmentName;
                defectNew.id = defect.id;
                defectNew.ZoneID = defect.ZoneID;
                defectNew.ZoneName = results.ZoneName;
                defectNew.SubZoneID = defect.SubZoneID;
                defectNew.SubZoneName = results.SubZoneName;
                defectNew.FloorID = defect.FloorID;
                defectNew.FloorName = results.FloorName;
                defectNew.UpdatedOn = defect.UpdatedOn;
                defectNew.CreatedOn = defect.CreatedOn;
                defectNew.ReportedOn = defect.ReportedOn;
                defectNew.AcknowledgedBy = defect.AcknowledgedBy;
                defectNew.DefectPictureList = defect.DefectPictureList;
                defectNew.DefectDescriptionList = defect.DefectDescriptionList;
                defectNew.ExpectedCompleteDate = defect.ExpectedCompleteDate;
                defectNew.ResolvedPictureList = defect.ResolvedPictureList;
                defectNew.ResolvedDescriptionList = defect.ResolvedDescriptionList;
                defectNew.SentTechnicianList = JSON.stringify(defect.SentTechnicianList);

                // console.log('defect:');
                // console.log(defectNew);

                arrDefectResult.push(defectNew);
                //call cb1 to next defect
                cb1();
            });
        }, function(err) {
            if (err)
                return callback(err);
            callback(null, arrDefectResult);
        });
    }

    //define upload

    var storageDefectImg = multer.diskStorage({
        destination: './upload/defects/',
        filename: function(req, file, cb) {
            var UUID, username;
            if (req.decoded) {
                UUID = req.decoded.UUID;
                username = req.decoded.username;
            }
            // var defectID = req.body.defectID;
            DefectController.findByDefectID(id, function(err, defect) {
                // var id = defect.id;
                cb(null, UUID + '-' + file.originalname);
            });
        }
    });

    var storageResolveImg = multer.diskStorage({
        destination: './upload/resolves/',
        filename: function(req, file, cb) {
            var UUID, username;
            if (req.decoded) {
                UUID = req.decoded.UUID;
                username = req.decoded.username;
            }
            var defectID = req.body.defectID;

            cDefectController.findByDefectID(id, function(err, defect) {
                var id = defect.id;
                cb(null, id + '-' + file.originalname);
            });
        }
    });

    //Upload defect image --------------------------------

    var uploadDefect = multer({
        storage: storageDefectImg
    });

    var typeDefect = uploadDefect.single('fileDefect');

    APIRouter.post('/noauthen-uploadImageDefect', typeDefect, function(req, res, next) {
        console.log(req.file);
        res.json({
            'result': 'success'
        });
    });

    APIRouter.post('/uploadImageDefect', typeDefect, function(req, res, next) {
        console.log(req.file);
        res.json({
            'result': 'success'
        });
    });

    //End Upload Defect image----------------------------

    //Upload Resolve

    var uploadResolve = multer({
        storage: storageResolveImg
    });

    var typeResolve = uploadResolve.single('fileResolve');

    APIRouter.post('/uploadImageResolve', typeResolve, function(req, res, next) {
        console.log(req.file);
        res.json({
            'result': 'success'
        });

    });

    //----------------------------------------------

    APIRouter.post('/authenTechnicianAndUpdateInfo', function(req, res, next) {
        var bodyRequest = req.body;
        var tokenNotification = bodyRequest.tokenNotification || '';
        var decoded = req.decoded;
        var UUID = bodyRequest.UUID;
        TechnicianController.findByUserName(decoded.username, function(err, technician) {
            if (err)
                return next(err);
            if (technician.UUID != UUID) {
                res.json({
                    result: "You logged in a different device"
                });
            } else {
                console.log(technician);
                TechnicianController.update(technician.id, {
                    TokenNotifi: tokenNotification
                }, function(err, technician) {
                    if (err)
                        return next(err);
                    res.json({
                        result: 'success'
                    });
                });
            }
        });
    });

    APIRouter.post('/noauthen-loginTechnicianAndUpdateNotifi', function(req, res, next) {
        var bodyRequest = req.body;
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
            console.log(technician);
            //get token with sign username
            if (technician.UUID != UUID) {
                console.log('UUID: ' + UUID)
                //send Notification for previous technician
                // NotificationController.sendNotification(technician.Platform, "Technician", technician.TokenNotifi, {
                //     alert: "You logged in a new device.",
                // });
            }

            var objSet = {
                UUID: UUID,
                TokenNotifi: tokenNotification,
                Platform: bodyRequest.platform
            }
            TechnicianController.update(technician.id, objSet, function(err, t) {
                var token = jwt.sign({
                    username: technician.Username
                }, secretJWT);

                res.json({
                    token: token
                });
            });

            // });
        });
    });

    APIRouter.get('/noauthen-downloadImageResolve/:fileName', function(req, res, next) {
        console.log(req.params);
        var file = app.environment.root + '/upload/resolve/123-1439836397955.jpg';
        console.log(file);
        res.download(file);
    });

    APIRouter.get('/downloadImageDefect/:fileName', function(req, res, next) {
        var fileName = req.params.fileName;
        // var idx = fileName.lastIndexOf('-');
        // var id = fileName.substr(0, idx);
        // fileName = fileName.substr(idx + 1);
        // DefectController.findByID(id, function(err, defect) {
        //     var reportedBy = defect.ReportedBy.toString();
        var file = app.environment.root + '/upload/defects/' + fileName;
        res.download(file);
        // });
    });

};