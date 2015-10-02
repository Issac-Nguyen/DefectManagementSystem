'use strict';

angular.module('angularTokenAuthApp.controllers', [ 'ui.bootstrap',])
    .controller('HomeController', ['$scope', '$state', '$http', 'Utils', 'Auth', '$modal', 'uiGridConstants', 'tops',
        function($scope, $state, $http, Utils, Auth, $modal, uiGridConstants, topsList) {
            // $scope.topsList = topsList;
            console.log(topsList[0]);
            var modal;
            var rowEntity = {};
            var action;
            var rowCopy = {};

            var paginationOptions = {
                pageNumber: 1,
                pageSize: 5,
                sort: null
            };

            //grid options
            // $scope.gridOptions = {
            // 	    enableFiltering: true,
            //   onRegisterApi: function(gridApi){
            //     $scope.gridApi = gridApi;
            //   },
            //   data: topsList
            // }


            $scope.gridOptions = {
                // paginationPageSizes: [25, 50, 75],
                // paginationPageSizes: [25, 50, 75],
                paginationPageSizes: [5],
                useExternalPagination: true,
                // useExternalSorting: true,
                columnDefs: [{
                    field: 'Name',
                    title: 'Name',
                    enableSorting: true
                }, {
                    field: 'MaxNoDefectPicture',
                    title: 'Maximum Defect Picture',
                    enableSorting: false
                }, {
                    field: 'MaxNoResolvedPicture',
                    title: 'Maximum Resolve Picture',
                    enableSorting: false
                }, {
                    field: 'UseCameraOnly',
                    enableSorting: false,
                    title: 'Only Use Camera',
                    cellTemplate: Utils.templateTrueFalseCell()
                }, {
                    field: 'RetrieveFromLibrary',
                    enableSorting: false,
                    title: 'Only Retrieve from Liblary',
                    cellTemplate: Utils.templateTrueFalseCell()
                }, {
                    field: 'DefectPictureIsNeeded',
                    enableSorting: false,
                    title: 'Defect Picture is need',
                    cellTemplate: Utils.templateTrueFalseCell()
                }, {
                    field: 'DefectDescIsNeeded',
                    enableSorting: false,
                    title: 'Defect Description is need',
                    cellTemplate: Utils.templateTrueFalseCell()
                }, {
                    field: 'ResolvePictureIsNeeded',
                    enableSorting: false,
                    title: 'Resolve Picture is need',
                    cellTemplate: Utils.templateTrueFalseCell()
                }, {
                    field: 'ResolveDescIsNeeded',
                    enableSorting: false,
                    title: 'Resolve Description is need',
                    cellTemplate: Utils.templateTrueFalseCell()
                }, {
                    field: 'id',
                    name: ' ',
                    enableSorting: false,
                    cellTemplate: 'edit-button-cell.html',
                    width: 40,
                    enableHiding: false
                }, {
                    field: 'id',
                    name: '  ',
                    enableSorting: false,
                    cellTemplate: 'delete-button-cell.html',
                    width: 55
                }],
                onRegisterApi: function(gridApi) {
                    $scope.gridApi = gridApi;
                    // $scope.gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
                    //     if (sortColumns.length == 0) {
                    //         paginationOptions.sort = null;
                    //     } else {
                    //         paginationOptions.sort = sortColumns[0].sort.direction;
                    //     }
                    // getPage();
                    // });

                    gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
                        paginationOptions.pageNumber = newPage;
                        paginationOptions.pageSize = pageSize;
                        getPage();
                    });
                }
            };

            function getPage() {
                var url;
                switch (paginationOptions.sort) {
                    case uiGridConstants.ASC:
                        url = '/data/100_ASC.json';
                        break;
                    case uiGridConstants.DESC:
                        url = '/data/100_DESC.json';
                        break;
                    default:
                        url = '/data/100.json';
                        break;
                }

                // $http.get(url)
                // .success(function (data) {
                var data = topsList.splice(paginationOptions.pageNumber - 1, paginationOptions.pageSize);
                $scope.gridOptions.totalItems = topsList.length;
                // var firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
                var firstRow = 0;
                $scope.gridOptions.data = data;
                // });

            };

            getPage();

            //angular-form
            $scope.schema = {
                type: "object",
                properties: {
                    Name: {
                        type: "string",
                        // minLength: 1,
                        title: "Name",
                        required: true
                    },
                    // defectPictureSize: {
                    //     type: "string",
                    //     minLength: 2,
                    //     title: "Defect Picture Size",
                    // },
                    // resolvePictureSize: {
                    //     type: "string",
                    //     minLength: 2,
                    //     title: "Resolve Picture Size",
                    // },
                    maxNoDefectPicture: {
                        type: "integer",
                        minimum: 0,
                        default: 4,
                        title: "Maximum Defect Picture",
                    },
                    maxNoResolvePicture: {
                        type: "integer",
                        minimum: 0,
                        default: 4,
                        title: "Maximum Resolve Picture",
                    },
                    cameraOnly: {
                        type: "boolean",
                        default: true,
                        title: 'Only Use Camera'
                    },
                    retrieveFromLiblary: {
                        type: "boolean",
                        default: false,
                        title: 'Only Retrieve from Liblary'
                    },
                    defectPictureIsNeed: {
                        type: "boolean",
                        default: false,
                        title: 'Defect Picture is need'
                    },
                    defectDescIsNeed: {
                        type: "boolean",
                        default: false,
                        title: 'Defect Description is need'
                    },
                    resolvePictureIsNeed: {
                        type: "boolean",
                        default: false,
                        title: 'Resolve Picture is need'
                    },
                    resolveDescIsNeed: {
                        type: "boolean",
                        default: false,
                        title: 'Resolve Description is need'
                    },
                }
            };

            $scope.form = [
                "Name",
                // "defectPictureSize", "resolvePictureSize",
                "maxNoDefectPicture", "maxNoResolvePicture", {
                    key: "cameraOnly",
                    type: "radios",
                    titleMap: [{
                        value: true,
                        name: "Yes"
                    }, {
                        value: false,
                        name: "No"
                    }]
                }, {
                    key: "retrieveFromLiblary",
                    type: "radios",
                    titleMap: [{
                        value: true,
                        name: "Yes"
                    }, {
                        value: false,
                        name: "No"
                    }]
                }, {
                    key: "defectPictureIsNeed",
                    type: "radios",
                    titleMap: [{
                        value: true,
                        name: "Yes"
                    }, {
                        value: false,
                        name: "No"
                    }]
                }, {
                    key: "defectDescIsNeed",
                    type: "radios",
                    titleMap: [{
                        value: true,
                        name: "Yes"
                    }, {
                        value: false,
                        name: "No"
                    }]
                }, {
                    key: "resolvePictureIsNeed",
                    type: "radios",
                    titleMap: [{
                        value: true,
                        name: "Yes"
                    }, {
                        value: false,
                        name: "No"
                    }]
                }, {
                    key: "resolveDescIsNeed",
                    type: "radios",
                    titleMap: [{
                        value: true,
                        name: "Yes"
                    }, {
                        value: false,
                        name: "No"
                    }]
                }, {
                    type: "actions",
                    items: [{
                        type: 'submit',
                        style: "btn-default btn-primary",
                        title: 'Ok'
                    }, {
                        type: 'button',
                        title: 'Reset',
                        onClick: "resetForm()"
                    }, {
                        type: 'button',
                        title: 'Cancel',
                        onClick: "closeModal()"
                    }]
                }
            ];

            $scope.model = {};

            $scope.logout = function() {
                Auth.logout();
                $state.go('public.login');
            };

            function openModal() {
                modal = $modal.open({
                    animation: true,
                    templateUrl: "ModalCreateEdit.html",
                    scope: $scope,
                    keyboard: false,
                    backdrop: 'static'
                });
            }

            $scope.onBtnAddNew = function() {
                $scope.HeaderModal = "New Top";
                action = "New";
                openModal();
            }

            $scope.editRow = function(grid, row) {
                $scope.HeaderModal = "Edit Top";
                resetVar();
                angular.copy(row.entity, rowEntity);
                angular.copy(row.entity, rowCopy);
                // $scope.model = row.entity;
                $scope.model = rowEntity
                action = "Edit";
                openModal();
            }


            $scope.logModel = function() {
                console.log($scope.model);
            }

            $scope.resetForm = function() {
                $scope.model = Utils.getDefaultValueFromSchema($scope.schema);
            }

            $scope.onSubmit = function(form) {
                $scope.$broadcast('schemaFormValidate');
                var url = action == "New" ? "/webapi/addTop" : "/webapi/updateTop"
                if (form.$valid) {
                    console.log('valid');
                    $http({
                        method: 'POST',
                        url: url,
                        data: $scope.model
                    })
                        .then(function(data) {
                            console.log(data.data);
                            if (data.data.result == 'success') {
                                if (action == "New") {
                                    $scope.gridOptions.data.push($scope.model);
                                } else {
                                    var index = Utils.getIndex($scope.gridOptions.data, rowEntity);
                                    console.log(index);
                                    $scope.gridOptions.data.splice(index, 1, $scope.model);
                                }
                                $scope.model = Utils.getDefaultValueFromSchema($scope.schema);
                                modal.close();
                            } else {
                                // $scope.model = Utils.getDefaultValueFromSchema($scope.schema);
                                // modal.close();
                            }

                        }, function(err) {
                            console.log(err);
                        });
                }
            }

            $scope.closeModal = function() {
                modal.close();
            }

            $scope.deleteRow = function(grid, row) {
                rowEntity = row.entity;
                $scope.HeaderModal = 'Delete Top';
                modal = $modal.open({
                    animation: true,
                    templateUrl: "ModalDel.html",
                    scope: $scope,
                    keyboard: false,
                    backdrop: 'static'
                });
            }

            $scope.btnDeleteClick = function() {
                console.log('delete ' + rowEntity.id);
                $http({
                    method: 'POST',
                    url: '/webapi/delTop',
                    data: {
                        id: rowEntity.id
                    }
                })
                    .then(function(data) {
                        console.log(data.data);
                        if (data.data.result == 'success') {
                            var index = Utils.getIndex($scope.gridOptions.data, rowEntity);
                            $scope.gridOptions.data.splice(index, 1);
                            modal.close();
                        } else {
                            // $scope.model = Utils.getDefaultValueFromSchema($scope.schema);
                            // modal.close();
                        }

                    }, function(err) {
                        console.log(err);
                    });
                modal.close();
            }

            function resetVar() {
                rowEntity = {};
                rowCopy = {};
            }
        }
    ]);