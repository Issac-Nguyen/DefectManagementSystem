'use strict';
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var CompanySchema = new Schema({
	Name: {
		type: String,
		index: true,
		required: true
	},
	CompanyNo: {
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
	TotalTechnician: {
		type: Number,
	},
	TotalBuilding: {
		type: Number,
	},
	OrangeInDay: {
		type: Number,
		default: 3
	},
	RedInDay: {
		type: Number,
		default: 7
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
	collection: 'Company'
});

// CompanySchema.virtual('password').set(function(password) {
// 	this.salt = (Math.random() * 1e8).toString(36).slice(0, 5);
// 	this.hashedPassword = encryptPassword(password, this.salt);
// });

// CompanySchema.methods.checkPassword = function(password) {
// 	return encryptPassword(password, this.salt) === this.hashedPassword;
// };

CompanySchema.pre('save', function(next) {
	this.UpdatedOn = Date.now;
	if ( !this.CreatedOn ) {
    	this.CreatedOn = now;
  	}
	next();
});

CompanySchema.set('toJSON', {
	getters: true,
	virtuals: true
});

CompanySchema.set('toObject', {
	getters: true,
	virtuals: true
});

var Company = mongoose.model('Company', CompanySchema);


module.exports = {
	schema: CompanySchema,
	model: Company,
	modelName: 'Company'
};