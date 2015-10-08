'use strict';
var async = require('async'),
	_ = require('lodash');

module.exports = function(app) {


	var requestLogger = function(req, res, next) {

		var dataType, key, reg, request, value;
		var method = req.method.toLowerCase();
		request = new app.models.Request({
			ip: req.ip,
			method: method,
			url: req.originalUrl,
			headers: req.headers,
			query: req.query
		});

		if (method === 'put' || method === 'post') {
			request.body = req.body;
		}

		if (!req.session || !req.session.passport || !req.session.passport.user) return next();

		var username = req.session.passport.user || 'undefined';
		app.services.User.findByUsername(username, function(err, user) {
			if (err) {
				return console.debug('Request Logging: Can\'t find user. Err: ' + err + '\n URL: ' + req.originalUrl);
			} else if (user) {
				request.user = user.username;
			}
			request.save(function(err) {
				if (err) {
					console.debug('Request Logging: Can\'t save request. Err: ' + err + '\n URL: ' + req.originalUrl);
					return console.debug(err);
				}
				req.id = request.id;
				req.createdDate = request.createdDate;
				next();
			});
		});

	};

	var responseLogger = function(req, res, next) {
		var write = res.write,
			end = res.end,
			chunks = [],
			firstChunk = true,
			count = 0;
		if (!req.id) {
			console.debug('Request does not contain ID');
			return next();
		}

		req.on('close', function() {
			res.end = res.write = function() {};
			return;
		});

		res.set('requestId', req.id);

		var response = {
			requestedAt: req.createdAt
		};

		res.write = function(chunk) {
			if (String(chunk !== '\n')) {
				++count;
			}
			if (firstChunk) {
				firstChunk = false;
				response.startAt = Date.now();
				response.durationToStart = response.startAt - response.requestedAt;
			}
			chunks.push(chunk);
			write.apply(res, arguments);
			if (count > 100) {
				res.write = write;
				return res.write;
			}
		};
		res.end = function(chunk) {
			var key, value;
			if (chunk !== null) {
				chunks.push(chunk);
				if (firstChunk) {
					firstChunk = false;
					response.startAt = Date.now();
					response.durationToStart = response.startAt - response.requestedAt;
				}
			}

			if (req.method.toLowerCase() !== 'get') {
				try {
					response.body = chunks.join('');
				} catch (_error) {
					try {
						console.debug('[ERROR] Cannot join chunks. Trying Buffer.concat');
						response.body = Buffer.concat(chunks).toString('utf8');
					} catch (_error) {
						console.debug('[ERROR] : Cannot Buffer.concat!!');
						response.body = 'Cannot capture response body';
					}
				}
			} else {
				response.body = null;
			}
			response.endAt = Date.now();
			response.durationToFinish = response.endAt - response.requestedAt;
			response.statusCode = res.statusCode;
			response.headers = res._headers;
			app.services.Request.findById(req.id, function(err, request) {
				if (err || !request) {
					console.debug('Request Logging: Can\'t find request. Err: ' + err + '\n URL: ' + req.originalUrl);
					return next();
				}
				request.response = response;
				request.save();
			});
			return end.apply(res, arguments);
		};
		return next();
	};

	app.use(requestLogger);
	app.use(responseLogger);

};