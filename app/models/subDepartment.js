'use strict';
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var SubDepartmentSchema = new Schema({
	Name: {
		type: String,
		index: true,
		required: true
	},
	DepartmentID: {
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
	collection: 'SubDepartment'
});

// SubDepartmentSchema.virtual('password').set(function(password) {
// 	this.salt = (Math.random() * 1e8).toString(36).slice(0, 5);
// 	this.hashedPassword = encryptPassword(password, this.salt);
// });

// SubDepartmentSchema.methods.checkPassword = function(password) {
// 	return encryptPassword(password, this.salt) === this.hashedPassword;
// };

SubDepartmentSchema.pre('save', function(next) {
	if (!this['CreatedOn']) {
        this['CreatedOn'] = this['UpdatedOn'] = new Date;
      } else if (this.isModified()) {
        this['UpdatedOn'] = new Date;
      }
	next();
});

SubDepartmentSchema.set('toJSON', {
	getters: true,
	virtuals: true
});

SubDepartmentSchema.set('toObject', {
	getters: true,
	virtuals: true
});

var SubDepartment = mongoose.model('SubDepartment', SubDepartmentSchema);


module.exports = {
	schema: SubDepartmentSchema,
	model: SubDepartment,
	modelName: 'SubDepartment'
};