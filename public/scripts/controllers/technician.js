'use strict';

angular.module('angularTokenAuthApp.controllers')
    .controller('TechnicianController', ['$scope', '$state', '$q', '$http', 'Utils', 'Auth', '$modal', 'uiGridConstants', 'technicians', 'categorys', 'buildings', 'companys',
        function($scope, $state, $q, $http, Utils, Auth, $modal, uiGridConstants, techniciansList, categorysList, buildingsList, companysList) {
            var propertiesGrid = {
                pageSize: 2,
                pageNumber: 1
            };

            var categorysListTemp = [];

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


            $scope.callBackUI = function(options) {
                return categorysListTemp;
                // Note: Options is a reference to the original instance, if you change a value,
                // that change will persist when you use this form instance again.
            };

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
                    field: 'Username',
                    title: 'Username',
                    enableSorting: true
                }, {
                    field: 'Company_Name',
                    title: 'Company_Name',
                    enableSorting: false
                }, {
                    field: 'Email',
                    title: 'Email',
                    enableSorting: true
                }, {
                    field: 'ContactNo',
                    title: 'Contact No',
                    enableSorting: true
                }, {
                    field: 'CategoryList',
                    title: 'Category List',
                    enableSorting: true
                }, {
                    field: 'BuildingList',
                    title: 'Building List',
                    enableSorting: true
                }, {
                    field: 'TotalCloseCaseByDay',
                    title: 'Total Close Case By Day',
                    enableSorting: true
                }, {
                    field: 'TotalCloseCaseByMonth',
                    title: 'Total Close Case By Month',
                    enableSorting: true
                }, {
                    field: 'TotalCloseCaseByYear',
                    title: 'Total Close Case By Year',
                    enableSorting: true
                }, {
                    field: 'TotalCloseCaseUTD',
                    title: 'Total Close Case UTD',
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
                $http.get('/webapi/technicians', {
                    params: propertiesGrid
                })
                    .success(function(data) {
                        techniciansList = data.items;
                        // join();
                        $scope.gridOptions.totalItems = data.totalItems;
                        $scope.gridOptions.data = techniciansList;
                        if (cb)
                            cb();
                    });
            };

            //angular-form
            $scope.schema = {
                type: "object",
                properties: {
                    Username: {
                        type: "string",
                        minLength: 1,
                        title: "Username",
                        required: true
                    },
                    CompanyID: {
                        type: "string",
                        title: "Company",
                        required: true
                    },
                    Email: {
                        type: "string",
                        // minLength: 1,
                        title: "Email",
                    },
                    ContactNo: {
                        type: "string",
                        // minLength: 1,
                        title: "Contact No",
                    },
                    CategoryList: {
                        title: "Category List",
                        type: "array",
                        items: {
                            type: "integer"
                        },
                        default: []
                    },
                }
            };

            $scope.form = [{
                "key": "Username",
            }, {
                "key": "CompanyID",
                "type": "uiselect",
                "placeholder": "Choose a Company",
                "options": {
                    "callback": "callBackSD"
                },
                onChange: function(modelValue, form) {
                    categorysListTemp = categorysList.filter(function(item) {
                        return item.CompanyID.search(modelValue) > -1 || item.CompanyID == "";
                    });
                    $scope.form[4].titleMap = categorysListTemp;

                    // $scope.model.CategoryList = [];
                    resetMulSelect($scope.form[4], 'CategoryList');

                    // $scope.form[4].options.scope.uiMultiSelectInitInternalModel([]);
                }
            }, {
                "key": "Email",
            }, {
                "key": "ContactNo",
            }, {
                "key": "CategoryList",
                "type": "uiselectmultiple",
                "placeholder": "Choose Category",
                "options": {
                    "callback": "callBackUI"
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
            $scope.model.CategoryList = [];

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
                $scope.HeaderModal = "New Technician";
                action = "New";
                openModal();
            }

            $scope.editRow = function(grid, row) {
                $scope.HeaderModal = "Edit Technician";
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
                resetMulSelect($scope.form[4], 'CategoryList', categorysListTemp);
            }

            $scope.onSubmit = function(form) {
                $scope.$broadcast('schemaFormValidate');
                var url = action == "New" ? "/webapi/addTechnician" : "/webapi/updateTechnician"
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
                                // if (action == "New") {
                                //     getNamefromID();
                                //     $scope.gridOptions.data.push($scope.model);
                                // } else {
                                //     var index = Utils.getIndex($scope.gridOptions.data, rowEntity);
                                //     console.log(index);
                                //     getNamefromID();
                                //     $scope.gridOptions.data.splice(index, 1, $scope.model);
                                // }
                                getPage(function() {
                                    $scope.model = Utils.getDefaultValueFromSchema($scope.schema);
                                    modal.close();
                                });

                            } else {
                                // $scope.model = Utils.getDefaultValueFromSchema($scope.schema);
                                // modal.close();
                            }

                        }, function(err) {
                            console.log(err);
                        });
                }
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

            $scope.closeModal = function() {
                modal.close();
            }

            $scope.deleteRow = function(grid, row) {
                rowEntity = row.entity;
                $scope.HeaderModal = 'Delete Technician';
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
                    url: '/webapi/delTechnician',
                    data: {
                        id: rowEntity.id
                    }
                })
                    .then(function(data) {
                        console.log(data.data);
                        if (data.data.result == 'success') {
                            // var index = Utils.getIndex($scope.gridOptions.data, rowEntity);
                            getPage(function() {
                                // $scope.gridOptions.data.splice(index, 1);
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

            function join() {
                var deferred = $q.defer();

                techniciansList.map(function(item) {
                    // for (var i = 0; i < buildingsList.length; i++) {
                    //     if (item.BuildingID == buildingsList[i].id) {
                    //         item.Building_Name = buildingsList[i].Name;
                    //     }
                    // }
                });
                deferred.resolve();
                return deferred.promise;
            }

            function getNamefromID() {
                // for (var i = 0; i < buildingsList.length; i++) {
                //     if ($scope.model.BuildingID == buildingsList[i].id) {
                //         $scope.model.Building_Name = buildingsList[i].Name;
                //     }
                // }
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

            function resetMulSelect(formCtr, modelName, arrayItem) {
                setTimeout(function() {
                    formCtr.options.scope.$apply(function() {
                        formCtr.options.scope.$$childHead.$select.selected = [];
                    });
                }, 0);

                if ($scope.model[modelName])
                    $scope.model[modelName] = [];

                if(arrayItem) {
                    arrayItem = [];
                    formCtr.titleMap = arrayItem;
                }
            }

        }
    ]);