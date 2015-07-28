'use strict';
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId,
	crypto = require('crypto');

var TechnicianSchema = new Schema({
	UUID: {
		type: String,
		index: true,
		required: true
	},
	TokenNotifi: {
		type: String,
		index: true,
		required: true
	},
	Name: {
		type: String,
		index: true,
		required: true
	},
	BuildingID: {
		type: ObjectId,
		required: true
	},
	CompanyID: {
		type: ObjectId,
		required: true
	},
	salt: String,
	hashedPassword: {
		type: String,
		required: true
	}
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
	CategoryList: {
		type: Array,
	},
	BuildingList: {
		type: Array,
	},
	TotalCloseCaseByDay: {
		type: Number,
	},
	TotalCloseCaseByMonth: {
		type: Number,
	},
	TotalCloseCaseByYear: {
		type: Number,
	},
	TotalCloseCaseUTD: {
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
	collection: 'Technician'
});

TechnicianSchema.virtual('password').set(function(password) {
	this.salt = (Math.random() * 1e8).toString(36).slice(0, 5);
	this.hashedPassword = encryptPassword(password, this.salt);
});

TechnicianSchema.methods.checkPassword = function(password) {
	return encryptPassword(password, this.salt) === this.hashedPassword;
};

TechnicianSchema.pre('save', function(next) {
	if (!this['CreatedOn']) {
        this['CreatedOn'] = this['UpdatedOn'] = new Date;
      } else if (this.isModified()) {
        this['UpdatedOn'] = new Date;
      }
	next();
});

TechnicianSchema.set('toJSON', {
	getters: true,
	virtuals: true
});

TechnicianSchema.set('toObject', {
	getters: true,
	virtuals: true
});

var Technician = mongoose.model('Technician', TechnicianSchema);


module.exports = {
	schema: TechnicianSchema,
	model: Technician,
	modelName: 'Technician'
};