'use strict';
var lodash = require('lodash');
module.exports = function(app) {
    var UserService = {};

    UserService.findByUsername = function(username, callback) {
        return app.models.User.findOne({
            username: username
        }, callback);
    };

    UserService.findById = function(id, callback) {
        return app.models.User.findOne({
            _id: id
        }, callback);
    };

    UserService.list = function(req, res) {
        app.models.User.find(function(err, users) {
            if (err) return res.send(500);
            res.send(users);
        });
    }

    UserService.getMe = function(req, res) {
        res.send(req.user);
    }

    UserService.update = function(req, res) {
        var body = req.body;
        console.log(body);
        if (!body)
            return res.status(500).send(new Error('Error'));
        app.models.User.findOne({
            _id: body.id
        }, function(err, user) {
            if (err)
                return res.status(500).send(err);
            if (!user)
                res.status(401).send(new Error('Not Found'));
            user.local.password = body.data.password;
            console.log(user); 
            user.save(function(err) {
                if (err)
                    return res.status(500).send(err);
                app.models.User.findOne({
                    _id: body.id
                }, function(err, user) {
                    if (err)
                        return res.status(500).send(err);
                    console.log(user);
                    res.send(user);
                })
            })
        });
    }


    return {
        service: UserService,
        serviceName: 'User'
    };
};