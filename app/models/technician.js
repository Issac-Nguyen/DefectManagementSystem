'use strict';
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    crypto = require('crypto');

var encryptPassword = function(password, salt) {
    return crypto.createHash('md5').update(password + salt).digest('hex');
};

var TechnicianSchema = new Schema({
    UUID: {
        type: String,
        index: true,
        // required: true
    },
    TokenNotifi: {
        type: String,
        index: true,
        // required: true
    },
    Platform: {
        type: String
    },
    // BuildingID: {
    //     type: ObjectId,
    //     required: true
    // },
    CompanyID: {
        type: ObjectId,
        required: true
    },
    salt: String,
    hashedPassword: {
        type: String,
        required: true
    },
    Username: {
        type: String,
        required: true,
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
        default: 0
    },
    TotalCloseCaseByMonth: {
        type: Number,
        default: 0
    },
    TotalCloseCaseByYear: {
        type: Number,
        default: 0
    },
    TotalCloseCaseUTD: {
        type: Number,
        default: 0
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

TechnicianSchema.virtual('Password').set(function(Password) {
    this.salt = (Math.random() * 1e8).toString(36).slice(0, 5);
    this.hashedPassword = encryptPassword(Password, this.salt);
});

TechnicianSchema.methods.checkPassword = function(Password) {
    console.log(encryptPassword(Password, this.salt));
    console.log(this.hashedPassword);
    return encryptPassword(Password, this.salt) === this.hashedPassword;
};

TechnicianSchema.pre('save', function(next) {
    //set time
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

TechnicianSchema.options.toJSON = {
    transform: function(doc, ret, options) {

        // add id feild and remove _id and __v
        ret.id = ret._id;

        delete ret._id;
        delete ret.__v;
        delete ret.salt;
    }
};

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