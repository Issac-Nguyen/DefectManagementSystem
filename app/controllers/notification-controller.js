var apn = require('apn'),
    apnConnectionPublicUser,
    apnConnectionTechnician,
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
            }
        };
        apnConnectionPublicUser = new apn.Connection(options.apn.publicUser);
        apnConnectionTechnician = new apn.Connection(options.apn.technician);
    }

    var notificationObj = {};
    notificationObj.sendNotification = function(platform, type, token, obj, cb) {
        console.log('platform: ' + platform + ' \n type: ' + type + ' \n token: ' + token + '\n obj: ' + JSON.stringify(obj));
        var note = new apn.Notification();
        if (platform == 'iOS') {
            var myDevice = new apn.Device(token);
            var apnConnection;
            note.alert = obj.alert;
            note.payload = obj.payload;
            if (type == 'PublicUser') {
                apnConnection = apnConnectionPublicUser;
            } else if (type == 'Technician') {
                apnConnection = apnConnectionTechnician;
            }
            if (apnConnection) {
                apnConnection.pushNotification(note, myDevice);
            }
        } else if (platform == 'Android') {

        }

        if (cb)
            cb();
    }

    return notificationObj;
}