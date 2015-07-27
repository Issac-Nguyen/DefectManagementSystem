'use strict';
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId,
	crypto = require('crypto');

var encryptPassword = function(password, salt) {
	return crypto.createHash('md5').update(password + salt).digest('hex');
};

var UserSchema = new Schema({
	username: {
		type: String,
		required: true,
		index: {
			unique: true
		}
	},
	salt: String,
	hashedPassword: String,
	createdDate: {
		type: Date,
		default: Date.now
	},
	updatedDate: {
		type: Date,
		default: Date.now
	},
	accessToken: String,
	active:{
		type: Boolean,
		default: true
	},
	email: String,
}, {
	read: 'nearest'
});

UserSchema.virtual('password').set(function(password) {
	this.salt = (Math.random() * 1e8).toString(36).slice(0, 5);
	this.hashedPassword = encryptPassword(password, this.salt);
});

UserSchema.methods.checkPassword = function(password) {
	return encryptPassword(password, this.salt) === this.hashedPassword;
};

UserSchema.pre('save', function(next) {
	this.updatedDate = Date.now;
	next();
});

UserSchema.set('toJSON', {
	getters: true,
	virtuals: true
});

UserSchema.set('toObject', {
	getters: true,
	virtuals: true
});

var User = mongoose.model('user', UserSchema);


module.exports = {
	schema: UserSchema,
	model: User,
	modelName: 'User'
};