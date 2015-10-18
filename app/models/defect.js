'use strict';
var moment = require('moment');
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var DefectSchema = new Schema({
    idDefect: {
        type: String,
        required: true
    },
    BuildingID: {
        type: ObjectId,
        required: true
    },
    DepartmentID: {
        type: ObjectId,
        // required: true
    },
    SubDepartmentID: {
        type: ObjectId,
    },
    CategoryID: {
        type: ObjectId,
        // required: true
    },
    SubCategoryID: {
        type: ObjectId,
    },
    ZoneID: {
        type: ObjectId,
    },
    SubZoneID: {
        type: ObjectId,
    },
    FloorID: {
        type: ObjectId,
    },
    DefectStatus: {
        type: ObjectId,
        // required: true
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
    SentTechnicianList:{
        type: Array,
        default: []
    },
    SendStatusToUserByEmail: {
        type: Boolean,
        default: false
    },
    SendStatusTouserByNotification: {
        type: Boolean,
        default: true
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
    Status: {
        type: Number,
        default: 0
    }
}, {
    read: 'nearest',
    collection: 'Defect'
});

// DefectSchema.pre('validate', function(next) {
//     if (this.isNew) {
        
//         this['BuildingID'] = mongoose.Types.ObjectId(this['BuildingID']);
//         this['DepartmentID'] = mongoose.Types.ObjectId(this['DepartmentID']);
//         this['SubDepartmentID'] = mongoose.Types.ObjectId(this['SubDepartmentID']);
//         this['CategoryID'] = mongoose.Types.ObjectId(this['CategoryID']);
//         this['SubCategoryID'] = mongoose.Types.ObjectId(this['SubCategoryID']);
//         this['ZoneID'] = mongoose.Types.ObjectId(this['ZoneID']);
//         this['SubZoneID'] = mongoose.Types.ObjectId(this['SubZoneID']);
//         this['FloorID'] = mongoose.Types.ObjectId(this['FloorID']);
//         if (!this['CreatedBy']) {
//             this['ReportedBy'] = this['CreatedBy'] = this['UpdatedBy'] = mongoose.Types.ObjectId(this['CreatedBy']);
//         } else if (this.isModified()) {
//             // this['UpdatedBy'] = mongoose.Types.ObjectId(this['CreatedBy']);
//         }
//     }

//     next();
// });

DefectSchema.pre('save', function(next) {

    if (!this['CreatedOn']) {
        this['CreatedOn'] = this['UpdatedOn'] = new Date();
    } else if (this.isModified()) {
        this['UpdatedOn'] = new Date();
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