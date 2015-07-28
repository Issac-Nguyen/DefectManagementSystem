'use strict';
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var DefectSchema = new Schema({
	BuildingID: {
		type: ObjectId,
		required: true
	},
	CategoryID: {
		type: ObjectId,
		required: true
	},
	SubCategoryID: {
		type: ObjectId,
	},
	ZoneID: {
		type: ObjectId,
	},
	FloorID: {
		type: ObjectId,
	},
	DefectStatus: {
		type: ObjectId,
		required: true
	},
	ExpectedCompleteDate: {
		type: Date,
	},
	ReportedBy: {
		type: ObjectId,
	},
	ReportedOn: {
		type: Date,
	},
	DefectPictureList: {
		type: Array,
	},
	DefectDescriptionList: {
		type: Array,
	},
	AcknowledgedBy: {
		type: ObjectId,
	},
	AcknowledgedOn: {
		type: Date,
	},
	AcknowledgedRemark: {
		type: String,
	},
	ResolvedBy: {
		type: ObjectId,
	},
	ResolvedOn: {
		type: Date,
	},
	ResolvedPictureList: {
		type: Array,
	},
	ResolvedDescriptionList: {
		type: Array,
	},
	SendStatusToUserByEmail: {
		type: Boolean,
		default: false
	},
	SendStatusTouserByNotificaiton: {
		type: Boolean,
		default: false
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
	collection: 'Defect'
});

DefectSchema.pre('save', function(next) {
	this.UpdatedOn = Date.now;
	if ( !this.CreatedOn ) {
    	this.CreatedOn = now;
  	}
	next();
});

DefectSchema.set('toJSON', {
	getters: true,
	virtuals: true
});

DefectSchema.set('toObject', {
	getters: true,
	virtuals: true
});

var Defect = mongoose.model('Defect', DefectSchema);


module.exports = {
	schema: DefectSchema,
	model: Defect,
	modelName: 'Defect'
};