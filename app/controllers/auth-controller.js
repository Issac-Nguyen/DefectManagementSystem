'use strict';
var passport = require('passport'),
	_ = require('lodash'),
	NotificationServices;

module.exports = function(app) {
	var AuthenticationController = {};

	/**
	 * Authenticate user
	 */
	AuthenticationController.login = function(req, res, next) {
		passport.authenticate('local', function(err, user, info) {
			if (err) return next(err);
			if (user) {
				// Remove sensitive data before login
				user.password = undefined;
				user.salt = undefined;

				req.login(user, function(err) {
					if (err) {
						return res.status(400).send(err);
					}
					res.json(user);
				});
			} else {
				return res.status(401).json(info);
			}
		})(req, res, next);
	};

	/**
	 * Log user out
	 */
	AuthenticationController.logout = function(req, res, next) {
		req.logout();
		res.send(200);
	};

	/**
	 * Require login routing middleware
	 */
	AuthenticationController.requiresLogin = function(req, res, next) {
		if (!req.isAuthenticated()) {
			return res.status(401).send({
				message: 'User is not logged in'
			});
		}
		next();
	};

	/**
	 * User authorizations routing middleware
	 */
	AuthenticationController.hasPermission = function(req, res, next) {
		AuthenticationController.requiresLogin(req, res, function() {
			app.services.User.getPermissions(req.user.id, function(err, permissions) {
				if (err) {
					return res.status(400).send(err);
				}
				if (hasPermission(permissions, req.originalUrl, req.method)) {
					return next();
				}
				return res.status(401).send({
					message: 'User is not authorized'
				});
			});
		});
	};


	function matchWild(wild, name) {
		if (wild === '*') return true;
		wild = wild.replace(/\./g, '\\.');
		wild = wild.replace(/\?/g, '.');
		wild = wild.replace(/\\/g, '\\\\');
		wild = wild.replace(/\//g, '\\/');
		wild = wild.replace(/\*/g, '(.+?)*');
		var re = new RegExp(wild, 'i');
		return re.test(name);
	}

	function hasPermission(permissions, url, method) {
		var auth = false;
		for (var i = 0; i < permissions.length; i++) {
			if (matchWild(permissions[i].url, url)) {
				auth = true;
				break;
			}
		}
		return auth;
	}

	return AuthenticationController;
};