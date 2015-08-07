'use strict';
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var SubZoneSchema = new Schema({
	Name: {
		type: String,
		index: true,
		required: true
	},
	ZoneID: {
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
	collection: 'SubZone'
});

// SubZoneSchema.virtual('password').set(function(password) {
// 	this.salt = (Math.random() * 1e8).toString(36).slice(0, 5);
// 	this.hashedPassword = encryptPassword(password, this.salt);
// });

// SubZoneSchema.methods.checkPassword = function(password) {
// 	return encryptPassword(password, this.salt) === this.hashedPassword;
// };

SubZoneSchema.pre('save', function(next) {
	if (!this['CreatedOn']) {
        this['CreatedOn'] = this['UpdatedOn'] = new Date;
      } else if (this.isModified()) {
        this['UpdatedOn'] = new Date;
      }
	next();
});

SubZoneSchema.set('toJSON', {
	getters: true,
	virtuals: true
});

SubZoneSchema.set('toObject', {
	getters: true,
	virtuals: true
});

var SubZone = mongoose.model('SubZone', SubZoneSchema);


module.exports = {
	schema: SubZoneSchema,
	model: SubZone,
	modelName: 'SubZone'
};