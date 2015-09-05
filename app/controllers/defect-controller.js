'use strict';
var lodash = require('lodash'),
    moment = require('moment');
module.exports = function(app) {
    var DefectController = {};
    var DefectService = app.services.Defect;

    DefectController.findByDefectID = function(req, res) {
        DefectService.findByID(req.params.Id, function(err, defect) {
            if (err) {
                return res.json(err);
            }
            return res.json(defect);
        });
    }


    DefectController.add = function(data, callback) {
        var defectObj = {};
        defectObj['idDefect'] = data.id;
        defectObj['BuildingID'] = data['Building_id'];
        defectObj['DepartmentID'] = data['Department_id'];
        defectObj['SubDepartmentID'] = data['SubDepartment_id'];
        defectObj['CategoryID'] = data['Category_id'];
        defectObj['SubCategoryID'] = data['SubCategory_id'];
        defectObj['ZoneID'] = data['Zone_id'];
        defectObj['FloorID'] = data['Floor_id'];
        if (!data['CreatedBy']) {
            defectObj['ReportedBy'] = defectObj['CreatedBy'] = defectObj['UpdatedBy'] = data['CreatedBy'];
        // } else if (this.isModified()) {
        //     this['UpdatedBy'] = mongoose.Types.ObjectId(this['CreatedBy']);
        }

        defectObj['ReportedOn'] = moment(data.CreatedDate + ' ' + data.CreatedTime, 'DD/MM/YYYY HH:mm:SS').toDate();
        defectObj['ExpectedCompleteDate'] = moment(data.ExpectedDate, 'DD/MM/YYYY').toDate();
        if (data['Arr_imageDefect']) {
            var arrDefectPicture = JSON.parse(data['Arr_imageDefect']);
            var DefectPictureList = [];
            var DefectDescriptionList = [];
            for (var i = 0; i < arrDefectPicture.length; i++) {
                var item = arrDefectPicture[i];
                console.log(item);
                DefectPictureList.push(item.dataURL);
                DefectDescriptionList.push(item.description);
            }
            defectObj['DefectPictureList'] = DefectPictureList;
            defectObj['DefectDescriptionList'] = DefectDescriptionList;
        }

        if (data['Arr_imageResolve']) {
            var arrResolvePicture = JSON.parse(data['Arr_imageResolve']);
            var ResolvedPictureList = [];
            var ResolvedDescriptionList = [];
            for (var i = 0; i < arrResolvePicture.length; i++) {
                var item = arrResolvePicture[i];
                ResolvedPictureList.push(item.dataURL);
                ResolvedDescriptionList.push(item.description);
            }
            defectObj['ResolvedPictureList'] = ResolvedPictureList;
            defectObj['ResolvedDescriptionList'] = ResolvedDescriptionList;
        }

        console.log('defectObj:');
        console.log(defectObj);
        DefectService.add(defectObj, callback);
    }

    DefectController.findAllFromDateWithCallback = function(dateFrom, callback) {
        DefectService.findAllFromDate(dateFrom, callback);
    }

    DefectController.findAllFromDateAndRelateTechnicianWithCallback = function(dateFrom, objBuilding, objCategory, callback) {
        DefectService.findAllFromDateAndRelateTechnician(dateFrom, objBuilding, objCategory, callback);
    }

    return DefectController;
};