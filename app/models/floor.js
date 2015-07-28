'use strict';
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var FloorSchema = new Schema({
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
	Description: {
		type: String,
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
	collection: 'Floor'
});

// FloorSchema.virtual('password').set(function(password) {
// 	this.salt = (Math.random() * 1e8).toString(36).slice(0, 5);
// 	this.hashedPassword = encryptPassword(password, this.salt);
// });

// FloorSchema.methods.checkPassword = function(password) {
// 	return encryptPassword(password, this.salt) === this.hashedPassword;
// };

FloorSchema.pre('save', function(next) {
	this.UpdatedOn = Date.now;
	if ( !this.CreatedOn ) {
    	this.CreatedOn = now;
  	}
	next();
});

FloorSchema.set('toJSON', {
	getters: true,
	virtuals: true
});

FloorSchema.set('toObject', {
	getters: true,
	virtuals: true
});

var Floor = mongoose.model('Floor', FloorSchema);


module.exports = {
	schema: FloorSchema,
	model: Floor,
	modelName: 'Floor'
};