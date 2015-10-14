'use strict';
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var SubCategorySchema = new Schema({
	Name: {
		type: String,
		index: true,
		required: true
	},
	CategoryID: {
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
	collection: 'SubCategory'
});

// SubCategorySchema.virtual('password').set(function(password) {
// 	this.salt = (Math.random() * 1e8).toString(36).slice(0, 5);
// 	this.hashedPassword = encryptPassword(password, this.salt);
// });

// SubCategorySchema.methods.checkPassword = function(password) {
// 	return encryptPassword(password, this.salt) === this.hashedPassword;
// };

SubCategorySchema.pre('save', function(next) {
	if (!this['CreatedOn']) {
        this['CreatedOn'] = this['UpdatedOn'] = new Date;
      } else if (this.isModified()) {
        this['UpdatedOn'] = new Date;
      }
	next();
});

SubCategorySchema.set('toJSON', {
	getters: true,
	virtuals: true
});

SubCategorySchema.set('toObject', {
	getters: true,
	virtuals: true
});

var SubCategory = mongoose.model('SubCategory', SubCategorySchema);


module.exports = {
	schema: SubCategorySchema,
	model: SubCategory,
	modelName: 'SubCategory'
};