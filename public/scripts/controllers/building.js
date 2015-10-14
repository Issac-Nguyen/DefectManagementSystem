'use strict';

angular.module('angularTokenAuthApp.controllers')
    .controller('BuildingController', ['$scope', '$state', '$http', '$q', 'Utils', 'Auth', '$modal', 'uiGridConstants', 'companys', 'buildings',
        function($scope, $state, $http, $q, Utils, Auth, $modal, uiGridConstants, companysList, buildingsList) {
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

            $scope.callBackSD = function(options, search) {
                if (search) {
                    console.log("Here the select lis could be narrowed using the search value: " + search.toString());
                    return companysList.filter(function(item) {
                        return (item.name.search(search) > -1)
                    });
                } else {
                    return companysList;

                }
                // Note: Options is a reference to the original instance, if you change a value,
                // that change will persist when you use this form instance again.
            };

            //grid options
            // $scope.gridOptions = {
            // 	    enableFiltering: true,
            //   onRegisterApi: function(gridApi){
            //     $scope.gridApi = gridApi;
            //   },
            //   data: buildingsList
            // }

            getPage();

            $scope.gridOptions = {
                paginationPageSizes: [25],
                useExternalPagination: true,
                enableFiltering: true,
                useExternalFiltering: true,
                useExternalSorting: true,
                columnDefs: [{
                    field: 'Name',
                    displayName: 'Name',
                    enableSorting: true
                }, {
                    field: 'Company_Name',
                    displayName: 'Company',
                    enableSorting: false,
                    enableFiltering: false
                }, {
                    field: 'BuildingNo',
                    displayName: 'Building No',
                    enableSorting: true
                }, {
                    field: 'Address',
                    displayName: 'Address',
                    enableSorting: true
                }, {
                    field: 'RegisterOn',
                    displayName: 'Register On',
                    enableSorting: true,
                    cellFilter: 'dateString',
                }, {
                    field: 'InCharge',
                    displayName: 'InCharge',
                    enableSorting: true
                }, {
                    field: 'InChargeNo',
                    displayName: 'InCharge No',
                    enableSorting: true
                }, {
                    field: 'DateCompletedOn',
                    displayName: 'Date Complete On',
                    enableSorting: true,
                    cellFilter: 'dateString',
                }, {
                    field: 'CompleteOn',
                    displayName: 'Complete On',
                    enableSorting: true,
                    cellFilter: 'dateString',
                }, {
                    field: 'Remark',
                    displayName: 'Remark',
                    enableSorting: true,
                }, {
                    field: 'id',
                    name: ' ',
                    enableSorting: false,
                    cellTemplate: 'edit-button-cell.html',
                    width: 40,
                    enableHiding: false,
                    enableFiltering: false,
                }, {
                    field: 'id',
                    name: '  ',
                    enableSorting: false,
                    cellTemplate: 'delete-button-cell.html',
                    width: 55,
                    enableFiltering: false,
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
                $http.get('/webapi/buildings', {
                    params: propertiesGrid
                })
                    .success(function(data) {
                        buildingsList = data.items;
                        join();
                        $scope.gridOptions.totalItems = data.totalItems;
                        $scope.gridOptions.data = buildingsList;
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

            //angular-form
            $scope.schema = {
                type: "object",
                properties: {
                    Name: {
                        type: "string",
                        minLength: 1,
                        title: "Name",
                        required: true
                    },
                    CompanyID: {
                        title: "Company",
                        type: "string",
                        required: true
                    },
                    BuildingNo: {
                        title: "Building No",
                        type: "integer",
                        // required: true
                    },
                    Address: {
                        title: "Address",
                        type: "string",
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
                    DateCompletedOn: {
                        type: "string",
                        // minLength: 1,
                        format: "date",
                        title: "Date Completed On",
                        // required: true
                    },
                    CompleteOn: {
                        type: "string",
                        // minLength: 1,
                        format: "date",
                        title: "Completed On",
                        // required: true
                    },
                    Remark: {
                        type: "string",
                        // minLength: 1,
                        title: "Remark",
                        // required: true
                    },
                    // uiselect: {
                    //     title: "Single select for UI-select",
                    //     type: "string",
                    //     description: "This one is using UI-select, single selection. Fetches lookup values(titleMap) from a callback."
                    // },
                }
            };

            $scope.form = [{
                "key": "Name",
            }, {
                "key": "CompanyID",
                "type": "uiselect",
                "placeholder": "Choose a Company",
                "options": {
                    "callback": "callBackSD"
                },
                onChange: function(modelValue, form) {

                }
            }, {
                "key": "BuildingNo",
            }, {
                "key": "Address",
            }, {
                key: "RegisterOn",
                "minDate": "1995-09-01",
                "maxDate": "2999-12-31",
                // "format": "dd-mm-yyyy"
            }, {
                "key": "InCharge",
            }, {
                "key": "InChargeNo",
            }, {
                key: "DateCompletedOn",
                "minDate": "1995-09-01",
                "maxDate": "2999-12-31",
                // "format": "dd-mm-yyyy"
            }, {
                key: "CompleteOn",
                "minDate": "1995-09-01",
                "maxDate": "2999-12-31",
                // "format": "dd-mm-yyyy"
            }, {
                "key": "Remark",
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
            }];

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
                $scope.HeaderModal = "New Building";
                action = "New";
                openModal();
            }

            $scope.editRow = function(grid, row) {
                $scope.HeaderModal = "Edit Building";
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
                refreshSelect($scope.form[1], 'CompanyID');
            }

            $scope.onSubmit = function(form) {
                $scope.$broadcast('schemaFormValidate');
                var url = action == "New" ? "/webapi/addBuilding" : "/webapi/updateBuilding"
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
                $scope.resetForm();
            }

            $scope.deleteRow = function(grid, row) {
                rowEntity = row.entity;
                $scope.HeaderModal = 'Delete Building';
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
                    url: '/webapi/delBuilding',
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

            function refreshSelect(formCtr, modelName) {
                formCtr.options.scope.select_model.selected = "";
                formCtr.options.scope.populateTitleMap($scope.form[2]);
                if ($scope.model[modelName])
                    delete $scope.model[modelName];
            }

            function join() {
                var deferred = $q.defer();

                buildingsList.map(function(item) {
                    for (var i = 0; i < companysList.length; i++) {
                        if (item.CompanyID == companysList[i].id) {
                            item.Company_Name = companysList[i].Name;
                        }
                    }
                });
                deferred.resolve();
                return deferred.promise;
            }

            function getNamefromID() {
                for (var i = 0; i < companysList.length; i++) {
                    if ($scope.model.CompanyID == companysList[i].id) {
                        $scope.model.Company_Name = companysList[i].Name;
                    }
                }
            }

            function resetVar() {
                rowEntity = {};
                rowCopy = {};
            }
        }
    ]);