'use strict';
require('datejs');
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
    collection: 'Defect'
});

DefectSchema.pre('validate', function(next) {
    this['BuildingID'] = mongoose.Types.ObjectId(this['Building_id']);
    this['CategoryID'] = mongoose.Types.ObjectId(this['Category_id']);
    this['SubCategoryID'] = mongoose.Types.ObjectId(this['SubCategory_id']);
    this['ZoneID'] = mongoose.Types.ObjectId(this['Zone_id']);
    this['FloorID'] = mongoose.Types.ObjectId(this['Floor_id']);
    if (!this['CreatedBy']) {
        this['ReportedBy'] = this['CreatedBy'] = this['UpdatedBy'] = mongoose.Types.ObjectId(this['CreatedBy']);
    } else if (this.isModified()) {
        this['UpdatedBy'] = mongoose.Types.ObjectId(this['CreatedBy']);
    }

    this['ReportOn'] = Date.parse('July 8th, 2004, 10:30 PM');
    this['ExpectedCompleteDate'] = Date.parse('July 8th, 2004, 10:30 PM');
    if (this['Arr_imageDefect']) {
        var arrDefectPicture = this['Arr_imageDefect'];
        var DefectPictureList = [];
        var DefectDescriptionList = [];
        for (var i = 0; i < arrDefectPicture.length; i++) {
            var item = arrDefectPicture[i];
            DefectPictureList.push(item.pic);
            DefectDescriptionList.push(item.des);
        }
        this['DefectPictureList'] = DefectPictureList;
        this['DefectDescriptionList'] = DefectDescriptionList;
    }

    if (this['Arr_imageResolve']) {
        var arrResolvePicture = this['Arr_imageResolve'];
        var ResolvedPictureList = [];
        var ResolvedDescriptionList = [];
        for (var i = 0; i < arrResolvePicture.length; i++) {
            var item = arrResolvePicture[i];
            ResolvedPictureList.push(item.pic);
            ResolvedDescriptionList.push(item.des);
        }
        this['ResolvedPictureList'] = ResolvedPictureList;
        this['ResolvedDescriptionList'] = ResolvedDescriptionList;
    }

    next();
});

DefectSchema.pre('save', function(next) {

    if (!this['CreatedOn']) {
        this['CreatedOn'] = this['UpdatedOn'] = new Date;
    } else if (this.isModified()) {
        this['UpdatedOn'] = new Date;
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