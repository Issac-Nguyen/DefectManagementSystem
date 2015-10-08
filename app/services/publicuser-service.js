'use strict';
var lodash = require('lodash');
module.exports = function(app) {
    var PublicUserService = {};

    PublicUserService.findByUsername = function(username, callback) {
        return app.models.User.findOne({
            username: username
        }, callback);
    };

    PublicUserService.updateWithUUIDCallback = function(UUID, objset, callback) {
        return app.models.PublicUser.update({UUID: UUID}, {$set: objset}, callback);
    }

    PublicUserService.findByUUID = function(UUID, callback) {
        app.models.PublicUser.findOne({
            UUID: UUID
        }, callback);
    }

    PublicUserService.findById = function(id, callback) {
        app.models.PublicUser.findOne({
            _id: id
        }, callback);
    }

    PublicUserService.insert = function(obj, callback) {
        console.log(obj);
        app.models.PublicUser.findOneAndUpdate({
            UUID: obj.UUID
        }, {
            $set: {
                TokenNotifi: obj.TokenNotifi,
                Platform: obj.Platform
            }
        }, {
            upsert: true
        }, callback);
    }

    return {
        service: PublicUserService,
        serviceName: 'PublicUser'
    };
};