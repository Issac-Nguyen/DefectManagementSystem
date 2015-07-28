'use strict';
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var CategorySchema = new Schema({
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
	collection: 'Category'
});

// CategorySchema.virtual('password').set(function(password) {
// 	this.salt = (Math.random() * 1e8).toString(36).slice(0, 5);
// 	this.hashedPassword = encryptPassword(password, this.salt);
// });

// CategorySchema.methods.checkPassword = function(password) {
// 	return encryptPassword(password, this.salt) === this.hashedPassword;
// };

CategorySchema.pre('save', function(next) {
	if (!this['CreatedOn']) {
        this['CreatedOn'] = this['UpdatedOn'] = new Date;
      } else if (this.isModified()) {
        this['UpdatedOn'] = new Date;
      }
	next();
});

CategorySchema.set('toJSON', {
	getters: true,
	virtuals: true
});

CategorySchema.set('toObject', {
	getters: true,
	virtuals: true
});

var Category = mongoose.model('Category', CategorySchema);


module.exports = {
	schema: CategorySchema,
	model: Category,
	modelName: 'Category'
};