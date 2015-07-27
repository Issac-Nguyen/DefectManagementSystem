var mongoose = require('mongoose');
var Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var RequestSchema = new Schema({
	ip: String,
	url: String,
	method: {
		type: String,
		enum: ['get', 'put', 'post', 'del', 'patch', 'options', 'head']
	},
	headers: {},
	query: {},
	body: {},
	user: {
		type: String,
		ref: 'user'
	},
	createdDate: {
		type: Date,
		default: Date.now
	},
	response: {}
}, {
	read: 'nearest'
});

var Request = mongoose.model('request', RequestSchema);

module.exports = {
	schema: RequestSchema,
	model: Request,
	modelName: 'Request'
};