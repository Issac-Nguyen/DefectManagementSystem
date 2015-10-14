'use strict';

angular.module('angularTokenAuthApp.controllers')
    .controller('CompanyController', ['$scope', '$state', '$http', 'Utils', 'Auth', '$modal', 'uiGridConstants', 'companys',
        function($scope, $state, $http, Utils, Auth, $modal, uiGridConstants, companysList) {
            var propertiesGrid = {
                pageSize: 25,
                pageNumber: 1
            };

            $scope.user = Auth.getUser();
            
            var modal;
            var rowEntity = {};
            var action;
            var rowCopy = {};

            var paginationOptions = {
                pageNumber: 1,
                pageSize: 5,
                sort: null
            };

            getPage();


            $scope.gridOptions = {
                paginationPageSizes: [25],
                useExternalPagination: true,
                enableFiltering: true,
                useExternalFiltering: true,
                useExternalSorting: true,
                columnDefs: [{
                    field: 'Name',
                    title: 'Name',
                    enableSorting: true,
                    enableFiltering: true,
                    width: 120,
                }, {
                    field: 'CompanyNo',
                    title: 'Company No',
                    enableSorting: true,
                    enableFiltering: true,
                    width: 180,
                }, {
                    field: 'Address',
                    title: 'Address',
                    enableSorting: true,
                    enableFiltering: true,
                    width: 180,
                }, {
                    field: 'RegisterOn',
                    title: 'Register On',
                    enableSorting: true,
                    enableFiltering: false,
                    cellFilter: 'dateString',
                    width: 180,
                }, {
                    field: 'InCharge',
                    title: 'InCharge',
                    enableSorting: true,
                    enableFiltering: true,
                    width: 180,
                }, {
                    field: 'InChargeNo',
                    title: 'InChargeNo',
                    enableSorting: true,
                    enableFiltering: true,
                    width: 180,
                }, {
                    field: 'OrangeInDay',
                    title: 'Orange In Day',
                    enableSorting: true,
                    enableFiltering: true,
                    width: 180,
                }, {
                    field: 'RedInDay',
                    title: 'Red In Day',
                    enableSorting: true,
                    enableFiltering: true,
                    width: 180,
                }, {
                    field: 'TotalTechnician',
                    title: 'Total Technician',
                    enableSorting: false,
                    enableFiltering: false,
                    width: 180,
                }, {
                    field: 'TotalBuilding',
                    title: 'Total Building',
                    enableSorting: false,
                    enableFiltering: false,
                    width: 180,
                }, {
                    field: 'MaxNoDefectPicture',
                    title: 'Maximum Defect Picture',
                    enableSorting: true,
                    enableFiltering: true,
                    width: 180,
                }, {
                    field: 'MaxNoResolvedPicture',
                    title: 'Maximum Resolve Picture',
                    enableSorting: true,
                    enableFiltering: true,
                    width: 200,
                }, {
                    field: 'UseCameraOnly',
                    enableSorting: false,
                    title: 'Only Use Camera',
                    cellFilter: 'true_false',
                    enableFiltering: false,
                    width: 150,
                    // cellTemplate: Utils.templateTrueFalseCell()
                }, {
                    field: 'RetrieveFromLibrary',
                    enableSorting: false,
                    title: 'Only Retrieve from Liblary',
                    cellFilter: 'true_false',
                    enableFiltering: false,
                    width: 180,
                    // cellTemplate: Utils.templateTrueFalseCell()
                }, {
                    field: 'DefectPictureIsNeeded',
                    enableSorting: false,
                    title: 'Defect Picture is need',
                    cellFilter: 'true_false',
                    enableFiltering: false,
                    width: 200,
                    // cellTemplate: Utils.templateTrueFalseCell()
                }, {
                    field: 'DefectDescIsNeeded',
                    enableSorting: false,
                    title: 'Defect Description is need',
                    cellFilter: 'true_false',
                    enableFiltering: false,
                    width: 190,
                    // cellTemplate: Utils.templateTrueFalseCell()
                }, {
                    field: 'ResolvePictureIsNeeded',
                    enableSorting: false,
                    title: 'Resolve Picture is need',
                    cellFilter: 'true_false',
                    enableFiltering: false,
                    width: 210,
                    // cellTemplate: Utils.templateTrueFalseCell()
                }, {
                    field: 'ResolveDescIsNeeded',
                    enableSorting: false,
                    title: 'Resolve Description is need',
                    cellFilter: 'true_false',
                    enableFiltering: false,
                    width: 200,
                    // cellTemplate: Utils.templateTrueFalseCell()
                }, {
                    field: 'id',
                    name: ' ',
                    enableSorting: false,
                    cellTemplate: 'edit-button-cell.html',
                    width: 40,
                    enableHiding: false,
                    enableFiltering: false
                }, {
                    field: 'id',
                    name: '  ',
                    enableSorting: false,
                    cellTemplate: 'delete-button-cell.html',
                    width: 55,
                    enableHiding: false,
                    enableFiltering: false
                }],
                onRegisterApi: function(gridApi) {
                    $scope.gridApi = gridApi;
                    $scope.gridApi.core.on.sortChanged($scope, $scope.sortChanged);

                    $scope.gridApi.core.on.filterChanged($scope, function() {
                        var grid = this.grid;
                        for (var i = 0; i < grid.columns.length; i++) {
                            var item = grid.columns[i];
                            if (propertiesGrid[item.name])
                                delete propertiesGrid[item.name];
                            if (item.filters[0].term) {
                                propertiesGrid[item.name] = item.filters[0].term;
                            }
                        }
                        // console.log(propertiesGrid);
                        getPage();
                    });

                    gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
                        propertiesGrid.pageNumber = newPage;
                        propertiesGrid.pageSize = pageSize;
                        getPage();
                    });
                }
            };

            function getPage(cb) {
                $http.get('/webapi/companys', {
                    params: propertiesGrid
                })
                    .success(function(data) {
                        companysList = data.items;
                        // join();
                        $scope.gridOptions.totalItems = data.totalItems;
                        $scope.gridOptions.data = companysList;
                        if (cb)
                            cb();
                    });
                // var data = categorysList.splice(paginationOptions.pageNumber - 1, paginationOptions.pageSize);
                // $scope.gridOptions.totalItems = categorysList.length;
                // // var firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
                // var firstRow = 0;
                // $scope.gridOptions.data = data;
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
                    CompanyNo: {
                        type: "string",
                        // minLength: 1,
                        title: "Company No",
                        // required: true
                    },
                    Address: {
                        type: "string",
                        // minLength: 1,
                        title: "Address",
                        required: true
                    },
                    RegisterOn: {
                        type: "string",
                        // minLength: 1,
                        format: "date",
                        title: "Register On",
                        // required: true
                    },
                    InCharge: {
                        type: "string",
                        // minLength: 1,
                        title: "InCharge",
                        // required: true
                    },
                    InChargeNo: {
                        type: "string",
                        // minLength: 1,
                        title: "InCharge No",
                        // required: true
                    },
                    OrangeInDay: {
                        type: "integer",
                        title: "Orange In Day",
                        default: 3
                    },
                    RedInDay: {
                        type: "integer",
                        title: "Red In Day",
                        default: 7
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
                    MaxNoDefectPicture: {
                        type: "integer",
                        minimum: 0,
                        default: 4,
                        title: "Maximum Defect Picture",
                    },
                    MaxNoResolvedPicture: {
                        type: "integer",
                        minimum: 0,
                        default: 4,
                        title: "Maximum Resolve Picture",
                    },
                    CameraOnly: {
                        type: "boolean",
                        default: true,
                        title: 'Only Use Camera'
                    },
                    RetrieveFromLiblary: {
                        type: "boolean",
                        default: false,
                        title: 'Only Retrieve from Liblary'
                    },
                    DefectPictureIsNeeded: {
                        type: "boolean",
                        default: false,
                        title: 'Defect Picture is need'
                    },
                    DefectDescIsNeeded: {
                        type: "boolean",
                        default: false,
                        title: 'Defect Description is need'
                    },
                    ResolvePictureIsNeeded: {
                        type: "boolean",
                        default: false,
                        title: 'Resolve Picture is need'
                    },
                    ResolveDescIsNeeded: {
                        type: "boolean",
                        default: false,
                        title: 'Resolve Description is need'
                    },
                }
            };

            $scope.form = [
                "Name",
                "CompanyNo",
                "Address", {
                    key: "RegisterOn",
                    "minDate": "1995-09-01",
                    "maxDate": "2999-12-31",
                    // "format": "dd-mm-yyyy"
                }, "InCharge",
                "InChargeNo",
                "OrangeInDay",
                "RedInDay",
                // "defectPictureSize", "resolvePictureSize",
                "MaxNoDefectPicture",
                "MaxNoResolvedPicture", {
                    key: "CameraOnly",
                    type: "radios",
                    titleMap: [{
                        value: true,
                        name: "Yes"
                    }, {
                        value: false,
                        name: "No"
                    }]
                }, {
                    key: "RetrieveFromLiblary",
                    type: "radios",
                    titleMap: [{
                        value: true,
                        name: "Yes"
                    }, {
                        value: false,
                        name: "No"
                    }]
                }, {
                    key: "DefectPictureIsNeeded",
                    type: "radios",
                    titleMap: [{
                        value: true,
                        name: "Yes"
                    }, {
                        value: false,
                        name: "No"
                    }]
                }, {
                    key: "DefectDescIsNeeded",
                    type: "radios",
                    titleMap: [{
                        value: true,
                        name: "Yes"
                    }, {
                        value: false,
                        name: "No"
                    }]
                }, {
                    key: "ResolvePictureIsNeeded",
                    type: "radios",
                    titleMap: [{
                        value: true,
                        name: "Yes"
                    }, {
                        value: false,
                        name: "No"
                    }]
                }, {
                    key: "ResolveDescIsNeeded",
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
                $scope.HeaderModal = "New Company";
                action = "New";
                openModal();
            }

            $scope.editRow = function(grid, row) {
                $scope.HeaderModal = "Edit Company";
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
                console.log($scope.model);
                var url = action == "New" ? "/webapi/addCompany" : "/webapi/updateCompany"
                if (form.$valid) {
                    
                    $http({
                        method: 'POST',
                        url: url,
                        data: $scope.model
                    })
                        .then(function(data) {
                            console.log(data.data);
                            if (data.data.result == 'success') {
                                if (action == "New") {
                                    // getNamefromID();
                                    // $scope.gridOptions.data.push($scope.model);
                                    getPage();
                                } else {
                                    // var index = Utils.getIndex($scope.gridOptions.data, rowEntity);
                                    // getNamefromID();
                                    // $scope.gridOptions.data.splice(index, 1, $scope.model);
                                    getPage();
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
                $scope.HeaderModal = 'Delete Company';
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
                    url: '/webapi/delCompany',
                    data: {
                        id: rowEntity.id
                    }
                })
                    .then(function(data) {
                        console.log(data.data);
                        if (data.data.result == 'success') {
                            // var index = Utils.getIndex($scope.gridOptions.data, rowEntity);
                            // $scope.gridOptions.data.splice(index, 1);
                            getPage(function() {
                                modal.close();
                            });
                        } else {
                            // $scope.model = Utils.getDefaultValueFromSchema($scope.schema);
                            // modal.close();
                        }

                    }, function(err) {
                        console.log(err);
                    });
                modal.close();
            }

            //Sort Grid

            $scope.sortChanged = function(grid, sortColumns) {
                if (sortColumns.length === 0) {
                    delete propertiesGrid.sortType;
                    delete propertiesGrid.sortKey;
                } else {
                    switch (sortColumns[0].sort.direction) {
                        case uiGridConstants.ASC:
                            propertiesGrid.sortType = 'ASC';
                            propertiesGrid.sortKey = sortColumns[0].name;
                            break;
                        case uiGridConstants.DESC:
                            propertiesGrid.sortType = 'DESC';
                            propertiesGrid.sortKey = sortColumns[0].name;
                            break;
                        case undefined:
                            delete propertiesGrid.sortType;
                            delete propertiesGrid.sortKey;
                            break;
                    }
                }
                getPage();
            };

            function resetVar() {
                rowEntity = {};
                rowCopy = {};
            }
        }
    ]);