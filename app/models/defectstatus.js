'use strict';
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var DefectStatusSchema = new Schema({
	Name: {
		type: String,
		index: true,
		required: true
	},
	BuildingID: {
		type: ObjectId,
		index: true,
		required: true
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
	collection: 'DefectStatus'
});

// DefectStatusSchema.virtual('password').set(function(password) {
// 	this.salt = (Math.random() * 1e8).toString(36).slice(0, 5);
// 	this.hashedPassword = encryptPassword(password, this.salt);
// });

// DefectStatusSchema.methods.checkPassword = function(password) {
// 	return encryptPassword(password, this.salt) === this.hashedPassword;
// };

DefectStatusSchema.pre('save', function(next) {
	this.UpdatedOn = Date.now;
	if ( !this.CreatedOn ) {
    	this.CreatedOn = now;
  	}
	next();
});

DefectStatusSchema.set('toJSON', {
	getters: true,
	virtuals: true
});

DefectStatusSchema.set('toObject', {
	getters: true,
	virtuals: true
});

var DefectStatus = mongoose.model('DefectStatus', DefectStatusSchema);


module.exports = {
	schema: DefectStatusSchema,
	model: DefectStatus,
	modelName: 'DefectStatus'
};