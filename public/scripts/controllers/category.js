'use strict';

angular.module('angularTokenAuthApp.controllers')
    .controller('CategoryController', ['$scope', '$state', '$q', '$http', 'Utils', 'Auth', '$modal', 'uiGridConstants', 'companys', 'buildings', 'categorys',
        function($scope, $state, $q, $http, Utils, Auth, $modal, uiGridConstants, companysList, buildingsList, categorysList) {
            // $scope.categorysList = categorysList;
            var propertiesGrid = {
                pageSize: 2,
                pageNumber: 1
            };

            var buildingsListTemp = angular.copy(buildingsList);
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
                    return buildingsListTemp.filter(function(item) {
                        return (item.name.search(search) > -1)
                    });
                } else {
                    // return buildingsList.filter(function(item) {
                    //     return item.CompanyID.search($scope.CompanyID) > 1;
                    // });
                    return buildingsListTemp;
                }
            };

            $scope.callBackSDCompany = function(options, search) {
                if (search) {
                    console.log("Here the select lis could be narrowed using the search value: " + search.toString());
                    return companysList.filter(function(item) {
                        return (item.name.search(search) > -1)
                    });
                } else {
                    return companysList;
                }
            };

            //grid options
            // $scope.gridOptions = {
            // 	    enableFiltering: true,
            //   onRegisterApi: function(gridApi){
            //     $scope.gridApi = gridApi;
            //   },
            //   data: categorysList
            // }

            // var promise = join();
            // promise.then(getPage);
            getPage();

            $scope.gridOptions = {
                // paginationPageSizes: [25, 50, 75],
                // paginationPageSizes: [25, 50, 75],
                paginationPageSizes: [2],
                useExternalPagination: true,
                enableFiltering: true,
                useExternalFiltering: true,
                useExternalSorting: true,
                columnDefs: [{
                    field: 'Name',
                    title: 'Name',
                    enableSorting: true
                }, {
                    field: 'Description',
                    title: 'Description',
                    enableSorting: true
                }, {
                    field: 'Company_Name',
                    title: 'Company_Name',
                    enableSorting: true
                }, {
                    field: 'Building_Name',
                    title: 'Building_Name',
                    enableSorting: true
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
                $http.get('/webapi/categorys', {
                    params: propertiesGrid
                })
                    .success(function(data) {
                        categorysList = data.items;
                        join();
                        $scope.gridOptions.totalItems = data.totalItems;
                        $scope.gridOptions.data = categorysList;
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

            // getPage();

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
                    Description: {
                        type: "string",
                        // minLength: 1,
                        title: "Description",
                        required: true
                    },
                    CompanyID: {
                        title: "Company ID",
                        type: "string",
                        required: true
                        // description: "This one is using UI-select, single selection. Fetches lookup values(titleMap) from a callback."
                    },
                    BuildingID: {
                        title: "Building ID",
                        type: "string",
                        required: true
                        // description: "This one is using UI-select, single selection. Fetches lookup values(titleMap) from a callback."
                    },
                }
            };

            $scope.form = [{
                "key": "Name",
            }, {
                "key": "Description",
            }, {
                "key": "CompanyID",
                "type": "uiselect",
                "placeholder": "Choose a CompanyID",
                "options": {
                    "callback": "callBackSDCompany"
                },
                onChange: function(modelValue, form) {
                    buildingsListTemp = buildingsList.filter(function(item) {
                        return item.CompanyID.search(modelValue) > -1;
                    });
                    refreshSelect($scope.form[3], 'BuildingID');
                }
            }, {
                "key": "BuildingID",
                "type": "uiselect",
                "placeholder": "Choose a Building",
                "options": {
                    "callback": "callBackSD",
                    "filterTriggers": ["model.CompanyID"],
                    "filter": "item.CompanyID.indexOf(model.CompanyID) > -1"
                },
                onChange: function(modelValue, form) {
                    console.log(modelValue);
                }
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
                $scope.HeaderModal = "New Category";
                action = "New";
                openModal();
            }

            $scope.editRow = function(grid, row) {
                $scope.HeaderModal = "Edit Category";
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
                var url = action == "New" ? "/webapi/addCategory" : "/webapi/updateCategory"
                if (form.$valid) {
                    console.log($scope.model);
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
            }

            $scope.deleteRow = function(grid, row) {
                rowEntity = row.entity;
                $scope.HeaderModal = 'Delete Category';
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
                    url: '/webapi/delCategory',
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
                // modal.close();
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



            function join() {
                var deferred = $q.defer();

                categorysList.map(function(item) {
                    for (var i = 0; i < buildingsList.length; i++) {
                        if (item.BuildingID == buildingsList[i].id) {
                            item.Building_Name = buildingsList[i].Name;
                        }
                    }

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

                for (var i = 0; i < buildingsList.length; i++) {
                    if ($scope.model.BuildingID == buildingsList[i].id) {
                        $scope.model.Building_Name = buildingsList[i].Name;
                    }
                }
            }

            function resetVar() {
                rowEntity = {};
                rowCopy = {};
            }

            function refreshSelect(formCtr, modelName) {
                formCtr.options.scope.select_model.selected = undefined;
                formCtr.options.scope.populateTitleMap($scope.form[3]);
                if ($scope.model[modelName])
                    delete $scope.model[modelName];
            }
        }
    ]);