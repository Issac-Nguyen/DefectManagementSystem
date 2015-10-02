'use strict';
var express = require('express'),
    _ = require('lodash'),
    GenericRouter = express.Router(),
    unless = require('express-unless'),
    path = require('path');

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
        DefectController = require('../controllers/defect-controller')(app),
        TechnicianController = require('../controllers/technician-controller')(app),
        TopController = require('../controllers/top-controller')(app),
        UserController = require('../controllers/user-controller')(app),
        CompanyController = require('../controllers/company-controller')(app);

    // routes for sign in, sigin up
    GenericRouter.post('/signin', AuthenticationController.issueAccessToken);
    // GenericRouter.post('/signup', AuthenticationController.signup);

    // Restful webapi routes

    GenericRouter.post('/webapi/access_token', AuthenticationController.issueAccessToken);

    // routes which require acces_token
    GenericRouter.all('/webapi/*', AuthenticationController.bearerAuth);
    GenericRouter.get('/webapi/me', AuthenticationController.requiresAuth, UserController.getMe);
    // GenericRouter.get('/webapi/users', AuthenticationController.requiresAuth, UserController.list);
    GenericRouter.get('/webapi/tops', AuthenticationController.requiresAuth, TopController.findAll);
    GenericRouter.get('/webapi/buildings', AuthenticationController.requiresAuth, BuildingController.findAll);
    // GenericRouter.get('/webapi/categorys', AuthenticationController.requiresAuth, CategoryController.list);
    // GenericRouter.get('/webapi/subcategorys', AuthenticationController.requiresAuth, SubCategoryController.list);

    GenericRouter.post('/webapi/addTop', AuthenticationController.requiresAuth, TopController.add);
    GenericRouter.post('/webapi/delTop', AuthenticationController.requiresAuth, TopController.delete);
    GenericRouter.post('/webapi/updateTop', AuthenticationController.requiresAuth, TopController.update);

    //Building
    GenericRouter.post('/webapi/addBuilding', AuthenticationController.requiresAuth, BuildingController.add);
    GenericRouter.post('/webapi/delBuilding', AuthenticationController.requiresAuth, BuildingController.delete);
    GenericRouter.post('/webapi/updateBuilding', AuthenticationController.requiresAuth, BuildingController.update);

    // //Category
    // GenericRouter.post('/webapi/addCategory', AuthenticationController.requiresAuth, CategoryController.add);
    // GenericRouter.post('/webapi/delCategory', AuthenticationController.requiresAuth, CategoryController.del);
    // GenericRouter.post('/webapi/updateCategory', AuthenticationController.requiresAuth, CategoryController.update);

    // //SubCategory
    // GenericRouter.post('/webapi/addSubCategory', AuthenticationController.requiresAuth, SubCategoryController.add);
    // GenericRouter.post('/webapi/delSubCategory', AuthenticationController.requiresAuth, SubCategoryController.del);
    // GenericRouter.post('/webapi/updateSubCategory', AuthenticationController.requiresAuth, SubCategoryController.update);


    // serve index.html for all other route
    GenericRouter.all('/*', function(req, res) {
        res.sendFile(app.environment.root + '/public/views/index.html');
    });


    return GenericRouter;
}