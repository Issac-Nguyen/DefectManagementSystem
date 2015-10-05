'use strict';

angular.module('angularTokenAuthApp.controllers')
    .controller('SubDepartmentController', ['$scope', '$state', '$http', "$q", 'Utils', 'Auth', '$modal', 'uiGridConstants', 'departments', 'subdepartments',
        function($scope, $state, $http, $q, Utils, Auth, $modal, uiGridConstants, departmentsList, subdepartmentsList) {
            // $scope.subdepartmentsList = subdepartmentsList;

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
                    return departmentsList.filter(function(item) {
                        return (item.name.search(search) > -1)
                    });
                } else {
                    return departmentsList;

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
            //   data: subdepartmentsList
            // }
            // 
            var promise = joinDepartment();
            promise.then(getPage);

            console.log(subdepartmentsList[1]);

            $scope.gridOptions = {
                // paginationPageSizes: [25, 50, 75],
                // paginationPageSizes: [25, 50, 75],
                paginationPageSizes: [5],
                useExternalPagination: true,
                enableFiltering: true,
                // useExternalSorting: true,
                columnDefs: [{
                    field: 'Name',
                    title: 'Name',
                    enableSorting: true
                }, {
                    field: 'Description',
                    title: 'Description',
                    enableSorting: true
                }, {
                    field: 'Department_Name',
                    title: 'Department',
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
                var data = subdepartmentsList.splice(paginationOptions.pageNumber - 1, paginationOptions.pageSize);
                $scope.gridOptions.totalItems = subdepartmentsList.length;
                // var firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
                var firstRow = 0;
                $scope.gridOptions.data = data;
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
                    DepartmentID: {
                        title: "Department ID",
                        type: "string",
                        // description: "This one is using UI-select, single selection. Fetches lookup values(titleMap) from a callback."
                    },
                }
            };

            $scope.form = [{
                "key": "Name",
            }, {
                "key": "Description",
            }, {
                "key": "DepartmentID",
                "type": "uiselect",
                "placeholder": "Choose a Department",
                "options": {
                    "callback": "callBackSD"
                },
                onChange: function(modelValue, form) {

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
                $scope.HeaderModal = "New Department";
                action = "New";
                openModal();
            }

            $scope.editRow = function(grid, row) {
                $scope.HeaderModal = "Edit Department";
                resetVar();
                //copy to another object to keep value original in grid
                angular.copy(row.entity, rowEntity);
                // angular.copy(row.entity, rowCopy);
                // $scope.model = row.entity;
                $scope.model = rowEntity
                action = "Edit";
                openModal();
            }

            function changeDepartmentIDForm() {
                var a;
                a = 10;
            }


            $scope.logModel = function() {
                console.log($scope.model);
            }

            $scope.resetForm = function() {
                $scope.model = Utils.getDefaultValueFromSchema($scope.schema);
            }

            $scope.onSubmit = function(form) {
                $scope.$broadcast('schemaFormValidate');
                var url = action == "New" ? "/webapi/addSubDepartment" : "/webapi/updateSubDepartment"
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
                                    getDepartmentNamefromID();
                                    $scope.gridOptions.data.push($scope.model);
                                } else {
                                    var index = Utils.getIndex($scope.gridOptions.data, rowEntity);
                                    console.log(index);
                                    getDepartmentNamefromID();
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
                $scope.HeaderModal = 'Delete Sub-Department';
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
                    url: '/webapi/delSubDepartment',
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

            function joinDepartment() {
                var deferred = $q.defer();


                subdepartmentsList.map(function(item) {
                    for (var i = 0; i < departmentsList.length; i++) {
                        if (item.DepartmentID == departmentsList[i].id) {
                            item.Department_Name = departmentsList[i].Name;
                        }
                    }
                });
                deferred.resolve();
                return deferred.promise;
            }

            function getDepartmentNamefromID() {
                for (var i = 0; i < departmentsList.length; i++) {
                    if ($scope.model.DepartmentID == departmentsList[i].id) {
                        $scope.model.Department_Name = departmentsList[i].Name;
                    }
                }
            }
        }
    ]);