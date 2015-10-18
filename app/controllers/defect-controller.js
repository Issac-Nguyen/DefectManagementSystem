'use strict';
var lodash = require('lodash'),
    moment = require('moment');
module.exports = function(app) {
    var DefectController = {};
    var DefectService = app.services.Defect;

    DefectController.findByDefectID = function(id, callback) {
        DefectService.findByDefectID(id, callback);
    }

    DefectController.findByID = function(id, callback) {
        DefectService.findByID(id, callback);
    }

    DefectController.updateWithCallback = function(condition, objSet, callback) {
        if (objSet.Arr_imageResolve) {
            objSet.Arr_imageResolve = JSON.parse(objSet.Arr_imageResolve);
            for (var i = 0; i < objSet.Arr_imageResolve.length; i++) {
                var arrResolvePicture = JSON.parse(objSet['Arr_imageResolve'][i]);
                var ResolvedPictureList = [];
                var ResolvedDescriptionList = [];
                // for (var i = 0; i < arrResolvePicture.length; i++) {
                // var item = arrResolvePicture[i];
                ResolvedPictureList.push(arrResolvePicture.dataURL);
                ResolvedDescriptionList.push(arrResolvePicture.description);
                // }
            }
            objSet['ResolvedPictureList'] = ResolvedPictureList;
            objSet['ResolvedDescriptionList'] = ResolvedDescriptionList;
            // }
            delete objSet.Arr_imageResolve;
        }


        DefectService.updateWithCallback(condition, objSet, callback);
    }

    DefectController.updateWithIDAndCallback = function(id, objSet, callback) {
        if (objSet.Arr_imageResolve) {
            objSet.Arr_imageResolve = JSON.parse(objSet.Arr_imageResolve);
            for (var i = 0; i < objSet.Arr_imageResolve.length; i++) {
                var arrResolvePicture = objSet['Arr_imageResolve'][i];
                var ResolvedPictureList = [];
                var ResolvedDescriptionList = [];
                // for (j in arrResolvePicture) {
                //     var item = arrResolvePicture[j];
                //     ResolvedPictureList.push(item.dataURL);
                //     ResolvedDescriptionList.push(item.description);
                // }
                ResolvedPictureList.push(arrResolvePicture.dataURL);
                ResolvedDescriptionList.push(arrResolvePicture.description);
            }
            objSet['ResolvedPictureList'] = ResolvedPictureList;
            objSet['ResolvedDescriptionList'] = ResolvedDescriptionList;
            delete objSet.Arr_imageResolve;

            console.log(objSet);
        }


        DefectService.updateWithIDAndCallback(id, objSet, callback);
    }


    DefectController.add = function(data, callback) {
        var defectObj = data;
        defectObj['idDefect'] = data.id;
        // defectObj['BuildingID'] = data['BuildingID'];
        // defectObj['DepartmentID'] = data['DepartmentID'];
        // defectObj['SubDepartmentID'] = data['SubDepartmentID'];
        // defectObj['CategoryID'] = data['CategoryID'];
        // defectObj['SubCategoryID'] = data['SubCategoryID'];
        // defectObj['ZoneID'] = data['ZoneID'];
        // defectObj['SubZoneID'] = data['SubZoneID'];
        // defectObj['FloorID'] = data['FloorID'];
        if (data['CreatedBy']) {
            defectObj['ReportedBy'] = defectObj['CreatedBy'] = defectObj['UpdatedBy'] = data['CreatedBy'];
            // } else if (this.isModified()) {
            //     this['UpdatedBy'] = mongoose.Types.ObjectId(this['CreatedBy']);
        }

        defectObj['ReportedOn'] = moment(data.CreatedDate + ' ' + data.CreatedTime, 'DD/MM/YYYY HH:mm:SS').toDate();
        defectObj['ExpectedCompleteDate'] = moment(data.ExpectedCompleteDate, 'DD/MM/YYYY').toDate();
        if (data['Arr_imageDefect']) {
            var arrDefectPicture = JSON.parse(data['Arr_imageDefect']);
            var DefectPictureList = [];
            var DefectDescriptionList = [];
            for (var i = 0; i < arrDefectPicture.length; i++) {
                var item = arrDefectPicture[i];
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

        defectObj.Status = data.Status;

        DefectService.add(defectObj, callback);
    }

    DefectController.findAllFromDateWithCallback = function(dateFrom, callback) {
        DefectService.findAllFromDate(dateFrom, callback);
    }

    DefectController.findAllFromDateAndRelateTechnicianWithCallback = function(dateFrom, userID, objBuilding, objCategory, callback) {
        DefectService.findAllFromDateAndRelateTechnician(dateFrom, userID, objBuilding, objCategory, callback);
    }

    return DefectController;
};