'use strict';
var express = require('express'),
	APIRouter = express.Router(),
	_ = require('lodash'),
	GenericRouter = express.Router();
module.exports = function(app) {
	var UserController = require('../controllers/user-controller')(app),
		AuthenticationController = require('../controllers/auth-controller')(app);

	//Allow Origin Access Control for API
	app.all('*', function(req, res, next) {
		res.header('Access-Control-Allow-Credentials', true);
		res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
		res.header('Access-Control-Allow-Headers', 'x-prototype-version,x-requested-with,content-type,accept');
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

	APIRouter.modelMapping = {};

	APIRouter.get('/', function(req, res, next) {
		res.sendStatus(200);
	});

	// user routes

	 APIRouter.get('/users', UserController.findAll);
	// APIRouter.post('/users', UserController.create);
	// APIRouter.get('/users/:userId', UserController.find);
	// APIRouter.put('/users/:userId', UserController.update);
	// APIRouter.delete('/users/:userId', UserController.destroy);
	// APIRouter.post('/users/setgroups', UserController.setGroups);
	// APIRouter.modelMapping.users = 'User';

};