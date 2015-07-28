'use strict';
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var DepartmentSchema = new Schema({
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
	collection: 'Department'
});

// DepartmentSchema.virtual('password').set(function(password) {
// 	this.salt = (Math.random() * 1e8).toString(36).slice(0, 5);
// 	this.hashedPassword = encryptPassword(password, this.salt);
// });

// DepartmentSchema.methods.checkPassword = function(password) {
// 	return encryptPassword(password, this.salt) === this.hashedPassword;
// };

DepartmentSchema.pre('save', function(next) {
	if (!this['CreatedOn']) {
        this['CreatedOn'] = this['UpdatedOn'] = new Date;
      } else if (this.isModified()) {
        this['UpdatedOn'] = new Date;
      }
	next();
});

DepartmentSchema.set('toJSON', {
	getters: true,
	virtuals: true
});

DepartmentSchema.set('toObject', {
	getters: true,
	virtuals: true
});

var Department = mongoose.model('Department', DepartmentSchema);


module.exports = {
	schema: DepartmentSchema,
	model: Department,
	modelName: 'Department'
};