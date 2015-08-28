'use strict';
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId,
	crypto = require('crypto');

var encryptPassword = function(password, salt) {
	return crypto.createHash('md5').update(password + salt).digest('hex');
};

var PublicUserSchema = new Schema({
	UUID: {
		type: String,
		index: true,
		required: true
	},
	TokenNotifi: {
		type: String,
		index: true,
		// required: true
	},
	Platform: {
		type: String,
		required: true
	},
	BuildingID: {
		type: ObjectId,
		// required: true
	},
	salt: String,
	hashedPassword: {
		type: String,
	},
	Name: {
		type: String,
	},
	// Password: {
	// 	type: String,
	// },
	Email: {
		type: String,
	},
	ContactNo: {
		type: String,
	},
	NoClosedCase: {
		type: Number,
	},
	NoOpenCase: {
		type: Number,
	},
	CreatedBy: {
		type: ObjectId,
	},
	CreatedOn: {
		type: Date,
		default: new Date
	},
	UpdatedBy: {
		type: ObjectId,
	},
	UpdatedOn: {
		type: Date,
		default: new Date
	},
}, {
	read: 'nearest',
	collection: 'PublicUser'
});

PublicUserSchema.virtual('password').set(function(password) {
	this.salt = (Math.random() * 1e8).toString(36).slice(0, 5);
	this.hashedPassword = encryptPassword(password, this.salt);
});

PublicUserSchema.methods.checkPassword = function(password) {
	return encryptPassword(password, this.salt) === this.hashedPassword;
};

PublicUserSchema.pre('save', function(next) {
	if (!this['CreatedOn']) {
        this['CreatedOn'] = this['UpdatedOn'] = new Date;
      } else if (this.isModified()) {
        this['UpdatedOn'] = new Date;
      }
	next();
});

PublicUserSchema.set('toJSON', {
	getters: true,
	virtuals: true
});

PublicUserSchema.set('toObject', {
	getters: true,
	virtuals: true
});

var PublicUser = mongoose.model('PublicUser', PublicUserSchema);


module.exports = {
	schema: PublicUserSchema,
	model: PublicUser,
	modelName: 'PublicUser'
};