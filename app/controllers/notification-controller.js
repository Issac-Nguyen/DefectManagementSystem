var apn = require('apn'),
    gcm = require('node-gcm'),
apnConnectionPublicUser,
apnConnectionTechnician,
gcmPublicUser,
gcmTechnician,
options;

module.exports = function(app) {
    console.log(app.root);
    if (!apnConnectionPublicUser && !apnConnectionTechnician) {
        options = {
            apn: {
                publicUser: {
                    cert: app.environment.root + '/certificate/cert-publicUser.pem',
                    key: app.environment.root + '/certificate/key-publicUser.pem'
                },
                technician: {
                    cert: app.environment.root + '/certificate/cert-technician.pem',
                    key: app.environment.root + '/certificate/key-technician.pem'
                }
            },
            gcm: {
                publicUser: 'AIzaSyC9_ScVsY70hw5RCNsDuwX8Hsg9OHgbTjM',
                technician: 'AIzaSyDX-EzS-sakW5ULnCT-B9v5IQz65wP8BhE'
            }
        };
        apnConnectionPublicUser = new apn.Connection(options.apn.publicUser);
        apnConnectionTechnician = new apn.Connection(options.apn.technician);
        gcmPublicUser = new gcm.Sender(options.gcm.publicUser);
        gcmTechnician = new gcm.Sender(options.gcm.technician);
    }

    var notificationObj = {};
    notificationObj.sendNotification = function(platform, type, token, obj, cb) {
        console.log('platform: ' + platform + ' \n type: ' + type + ' \n token: ' + token + '\n obj: ' + JSON.stringify(obj));
        if (token == '') {
            if (cb)
                return cb();
            else
                return;
        }
        if(!platform)
            return;
        var note = new apn.Notification();
        if (platform == 'iOS') {
            var myDevice = new apn.Device(token);
            var apnConnection;
            note.alert = obj.alert;
            // note.payload = obj.payload;
            if (type == 'PublicUser') {
                apnConnection = apnConnectionPublicUser;
            } else if (type == 'Technician') {
                apnConnection = apnConnectionTechnician;
            }
            if (apnConnection) {
                apnConnection.pushNotification(note, myDevice);
            }
        } else if (platform.toLowerCase() == 'android') {
            var message = new gcm.Message();
            message.addData('alert', obj.alert);
            token = [token];
            if (type == 'PublicUser') {
                gcmPublicUser.send(message, {
                    registrationIds: token
                }, function(err, result) {
                    if (err) console.error(err);
                    else console.log(result);
                });
            } else if (type == 'Technician') {
                gcmTechnician.send(message, {
                    registrationIds: token
                }, function(err, result) {
                    if (err) console.error(err);
                    else console.log(result);
                });
            }
        }

        if (cb)
            cb();
    }

    return notificationObj;
}