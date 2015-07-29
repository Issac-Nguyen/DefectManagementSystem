'use strict';
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var BuildingSchema = new Schema({
	Name: {
		type: String,
		index: true,
		required: true
	},
	CompanyID: {
		type: ObjectId,
		index: true,
		required: true
	},
	BuildingNo: {
		type: String,
	},
	Address: {
		type: String,
		index: true,
		required: true
	},
	RegisterOn: {
		type: Date,
	},
	InCharge: {
		type: String,
	},
	InChargeNo: {
		type: String,
	},
	DateCompletedOn: {
		type: Date,
	},
	CompletedOn: {
		type: Date,
	},
	Remarks: {
		type: String,
	},
	TotalAsset: {
		type: Number,
	},
	TotalSchedule: {
		type: Number,
		default: 0
	},	
	Softcopy: {
		type: Array,
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
	collection: 'Building'
});

// BuildingSchema.virtual('password').set(function(password) {
// 	this.salt = (Math.random() * 1e8).toString(36).slice(0, 5);
// 	this.hashedPassword = encryptPassword(password, this.salt);
// });

// BuildingSchema.methods.checkPassword = function(password) {
// 	return encryptPassword(password, this.salt) === this.hashedPassword;
// };

BuildingSchema.pre('save', function(next) {
	if (!this['CreatedOn']) {
        this['CreatedOn'] = this['UpdatedOn'] = new Date;
      } else if (this.isModified()) {
        this['UpdatedOn'] = new Date;
      }
	next();
});

BuildingSchema.set('toJSON', {
	getters: true,
	virtuals: true
});

BuildingSchema.set('toObject', {
	getters: true,
	virtuals: true
});

var Building = mongoose.model('Building', BuildingSchema);


module.exports = {
	schema: BuildingSchema,
	model: Building,
	modelName: 'Building'
};