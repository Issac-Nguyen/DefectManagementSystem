'use strict';
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var TopSchema = new Schema({
	Name: {
		type: String,
		index: true,
		required: true
	},
	DefaultPictureSize: {
		type: String,
		default: '100x100'
	},
	ResolvedPictureSize: {
		type: String,
		default: '100x100'
	},
	MaxNoDefaultPicture: {
		type: Number,
		default: 4
	},
	MaxNoResolvedPicture: {
		type: Number,
		default: 4
	},
	UseCameraOnly: {
		type: Boolean,
		default: true
	},
	RetrieveFromLibrary: {
		type: Boolean,
		default: true
	},
	DefectPictureIsNeeded: {
		type: Boolean,
		default: yes
	},
	DefectDescIsNeeded: {
		type: Boolean,
		default: yes
	},
	CreatedBy: {
		type: ObjectId,
	},
	CreatedOn: {
		type: Date,
		default: Date.now
	},
	UpdatedBy: {
		type: ObjectId,
	},
	UpdatedOn: {
		type: Date,
		default: Date.now
	},
}, {
	read: 'nearest',
	collection: 'TOP'
});

// TopSchema.virtual('password').set(function(password) {
// 	this.salt = (Math.random() * 1e8).toString(36).slice(0, 5);
// 	this.hashedPassword = encryptPassword(password, this.salt);
// });

// TopSchema.methods.checkPassword = function(password) {
// 	return encryptPassword(password, this.salt) === this.hashedPassword;
// };

TopSchema.pre('save', function(next) {
	this.UpdatedOn = Date.now;
	if ( !this.CreatedOn ) {
    	this.CreatedOn = now;
  	}
	next();
});

TopSchema.set('toJSON', {
	getters: true,
	virtuals: true
});

TopSchema.set('toObject', {
	getters: true,
	virtuals: true
});

var TOP = mongoose.model('TOP', TopSchema);


module.exports = {
	schema: TopSchema,
	model: TOP,
	modelName: 'TOP'
};