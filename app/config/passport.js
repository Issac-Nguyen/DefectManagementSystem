'use strict';
var passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy;

module.exports = function(app) {
	passport.use(new LocalStrategy({
		usernameField: 'username',
		passwordField: 'password'
	}, function(username, password, done) {
		app.services.User.findByUsername(username, function(err, user) {
			if (err) {
				return done(err);
			}
			if (!user) {
				return done(null, false, {
					message: 'Incorrect username or password!'
				});
			}
			if (!user.active) {
				return done(null, false, {
					message: 'Your account is currently inactive.'
				});
			}
			if (!user.checkPassword(password)) {
				return done(null, false, {
					message: 'Incorrect username or passport!'
				});
			}
			return done(null, user.toObject());
		});
	}));

	passport.serializeUser(function(user, done) {
		done(null, user.username);
	});

	passport.deserializeUser(function(username, done) {
		app.services.User.findByUsername(username, function(err, user) {
			return done(null, user && user.toObject());
		});
	});
};