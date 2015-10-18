'use strict';

angular.module('angularTokenAuthApp.controllers')
    .controller('TechnicianController', ['$scope', '$state', '$q', '$http', 'Utils', 'Auth', '$modal', 'uiGridConstants', 'technicians', 'categorys', 'buildings', 'companys',
        function($scope, $state, $q, $http, Utils, Auth, $modal, uiGridConstants, techniciansList, categorysList, buildingsList, companysList) {
            var propertiesGrid = {
                pageSize: 25,
                pageNumber: 1
            };

            $scope.user = Auth.getUser();

            var categorysListTemp = [];
            var buildingsListTemp = [];
            var watchBuildingList;

            var modal;
            var rowEntity = {};
            var action;
            var rowCopy = {};

            var paginationOptions = {
                pageNumber: 1,
                pageSize: 5,
                sort: null
            };



            // watchBuildingList();

            function registerWatch() {
                watchBuildingList = $scope.$watch('form[5].options.scope.$$childHead.$select.selected', function() {
                    // console.log('BuildingList changed');
                    if ($scope.form[5].options.scope)
                        getTitleMapCategory($scope.form[5].options.scope.$$childHead.$select.selected);

                });
            }

            function unregisterWatch() {
                watchBuildingList();
            }

            $scope.callBackSD = function(options, search) {
                if (search) {
                    // console.log("Here the select lis could be narrowed using the search value: " + search.toString());
                    return companysList.filter(function(item) {
                        return (item.name.search(search) > -1)
                    });
                } else {
                    return companysList;
                }
            };


            $scope.callBackUICategory = function(options) {
                if ($scope.HeaderModal.search('Edit') > -1) {
                    categorysListTemp = categorysList.filter(function(item) {
                        return (($scope.model.CompanyID && item.CompanyID.search($scope.model.CompanyID) > -1) && ($scope.model.BuildingList && $scope.model.BuildingList.indexOf(item.BuildingID) > -1)) || item.CompanyID == "";
                    });

                } else if ($scope.HeaderModal.search('New') > -1) {
                    categorysListTemp = categorysList.filter(function(item) {
                        return (($scope.model.CompanyID && item.CompanyID.search($scope.model.CompanyID) > -1) && ($scope.model.BuildingID && $scope.model.BuildingList.indexOf(item.BuildingID) > -1)) || item.CompanyID == "";
                    });
                }

                return categorysListTemp;


            };

            $scope.callBackUIBuilding = function(options) {
                if ($scope.HeaderModal.search('Edit') > -1) {
                    buildingsListTemp = buildingsList.filter(function(item) {
                        return item.CompanyID && item.CompanyID.search($scope.model.CompanyID) > -1;
                    });

                } else if ($scope.HeaderModal.search('New') > -1) {
                    buildingsListTemp = buildingsList.filter(function(item) {
                        return item.CompanyID && item.CompanyID.search($scope.model.CompanyID) > -1;
                    });
                }
                return buildingsListTemp;
            };

            getPage();

            $scope.gridOptions = {
                paginationPageSizes: [25],
                useExternalPagination: true,
                enableFiltering: true,
                useExternalFiltering: true,
                useExternalSorting: true,
                columnDefs: [{
                    field: 'Username',
                    displayName: 'Username',
                    enableSorting: true,
                    width: 150
                }, {
                    field: 'Company_Name',
                    displayName: 'Company',
                    enableSorting: false,
                    width: 250
                }, {
                    field: 'Email',
                    displayName: 'Email',
                    enableSorting: true,
                    width: 220
                }, {
                    field: 'ContactNo',
                    displayName: 'Contact No',
                    enableSorting: true,
                    width: 220
                }, {
                    field: 'CategoryListName',
                    displayName: 'Category',
                    enableSorting: false,
                    enableFiltering: false,
                    width: 450
                }, {
                    field: 'BuildingListName',
                    displayName: 'Building',
                    enableSorting: false,
                    enableFiltering: false,
                    width: 450
                }, {
                    field: 'TotalCloseCaseByDay',
                    displayName: 'Total Close Case By Day',
                    enableSorting: false,
                    enableFiltering: false,
                    width: 220
                }, {
                    field: 'TotalCloseCaseByMonth',
                    displayName: 'Total Close Case By Month',
                    enableSorting: false,
                    enableFiltering: false,
                    width: 220
                }, {
                    field: 'TotalCloseCaseByYear',
                    displayName: 'Total Close Case By Year',
                    enableSorting: false,
                    enableFiltering: false,
                    width: 220
                }, {
                    field: 'TotalCloseCaseUTD',
                    displayName: 'Total Close Case UTD',
                    enableSorting: false,
                    enableFiltering: false,
                    width: 220
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
                        join();
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
                    Password: {
                        type: "string",
                        minLength: 1,
                        title: "Password",
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
                        "pattern": "^\\S+@\\S+$",
                        validationMessage: "Not a valid Email"
                    },
                    ContactNo: {
                        type: "string",
                        // minLength: 1,
                        title: "Contact No",
                    },
                    BuildingList: {
                        title: "Building",
                        type: "array",
                        items: {
                            type: "integer"
                        },
                        default: [],
                    },
                    CategoryList: {
                        title: "Category",
                        type: "array",
                        items: {
                            type: "integer"
                        },
                        default: [],
                    },
                }
            };

            $scope.form = [{
                "key": "Username",
            }, {
                "key": "Password",
            }, {
                "key": "CompanyID",
                "type": "uiselect",
                "placeholder": "Choose a Company",
                "options": {
                    "callback": "callBackSD"
                },
                onChange: function(modelValue, form) {
                    //for category
                    categorysListTemp = categorysList.filter(function(item) {
                        return (item.CompanyID.search(modelValue) > -1 && ($scope.model.BuildingList && $scope.model.BuildingList.indexOf(item.BuildingID) > -1)) || item.CompanyID == "";
                    });

                    //for building
                    buildingsListTemp = buildingsList.filter(function(item) {
                        return item.CompanyID.search(modelValue) > -1;
                    });

                    $scope.form[5].titleMap = buildingsListTemp;
                    $scope.form[6].titleMap = categorysListTemp;
                    resetMulSelect($scope.form[5], 'BuildingList');
                    resetMulSelect($scope.form[6], 'CategoryList');
                }
            }, {
                "key": "Email",
            }, {
                "key": "ContactNo",
            }, {
                "key": "BuildingList",
                "type": "uiselectmultiple",
                "placeholder": "Choose Building",
                onChange: function(modelValue, form) {
                    //for category
                    categorysListTemp = categorysList.filter(function(item) {
                        return (($scope.model.CompanyID && item.CompanyID.search($scope.model.CompanyID) > -1) && ($scope.model.BuildingID && $scope.model.BuildingID.indexOf(item.BuildingID) > -1)) || item.CompanyID == "";
                    });

                    $scope.form[6].titleMap = categorysListTemp;
                    resetMulSelect($scope.form[6], 'CategoryList');
                    console.log('changed');
                },
                "options": {
                    "callback": "callBackUIBuilding"
                }
            }, {
                "key": "CategoryList",
                "type": "uiselectmultiple",
                "placeholder": "Choose Category",
                "options": {
                    "callback": "callBackUICategory"
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

                modal.opened.then(function() {
                    setTimeout(registerWatch, 2000);
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
                // categorysListTemp = categorysList.filter(function(item) {
                //     return (item.CompanyID.search($scope.model.CompanyID) > -1 && $scope.model.CategoryList.indexOf(item.value) == -1) || item.CompanyID == "";
                // });
                action = "Edit";
                openModal();
            }


            $scope.logModel = function() {
                console.log($scope.model);
            }

            $scope.resetForm = function() {
                $scope.model = Utils.getDefaultValueFromSchema($scope.schema);
                refreshSelect($scope.form[2], 'CompanyID');
                resetMulSelect($scope.form[5], 'BuildingList', buildingsListTemp);
                resetMulSelect($scope.form[6], 'CategoryList', categorysListTemp);
            }

            $scope.onSubmit = function(form) {
                $scope.$broadcast('schemaFormValidate');
                var url = action == "New" ? "/webapi/addTechnician" : "/webapi/updateTechnician"
                if (form.$valid) {
                    console.log($scope.model);
                    $http({
                        method: 'POST',
                        url: url,
                        data: $scope.model
                    })
                        .then(function(data) {
                            // console.log(data.data);
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
                                    // modal.close();
                                    $scope.closeModal();
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
                $scope.resetForm();
                modal.close();
                unregisterWatch();
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
                // console.log('delete ' + rowEntity.id);
                $http({
                    method: 'POST',
                    url: '/webapi/delTechnician',
                    data: {
                        id: rowEntity.id
                    }
                })
                    .then(function(data) {
                        // console.log(data.data);
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
                    //join company
                    for (var i = 0; i < companysList.length; i++) {
                        if (item.CompanyID == companysList[i].id) {
                            item.Company_Name = companysList[i].Name;
                        }
                    }

                    //join Category
                    var arrCategoryListName = "";
                    for (var i = 0; i < item.CategoryList.length; i++) {
                        var it = item.CategoryList[i];
                        for (var j = 0; j < categorysList.length; j++) {
                            if (it == categorysList[j].id) {
                                arrCategoryListName = arrCategoryListName + categorysList[j].Name + ', ';
                                break;
                            }
                        }
                    }
                    arrCategoryListName = arrCategoryListName.substr(0, arrCategoryListName.length - 2);
                    item.CategoryListName = arrCategoryListName;

                    //join Building
                    var arrBuildingListName = "";
                    for (var i = 0; i < item.BuildingList.length; i++) {
                        var it = item.BuildingList[i];
                        for (var j = 0; j < buildingsList.length; j++) {
                            if (it == buildingsList[j].id) {
                                arrBuildingListName = arrBuildingListName + buildingsList[j].Name + ', ';
                                break;
                            }
                        }
                    }
                    arrBuildingListName = arrBuildingListName.substr(0, arrBuildingListName.length - 2);
                    item.BuildingListName = arrBuildingListName;

                    item.Password = item.hashedPassword;
                });


                deferred.resolve();
                return deferred.promise;
            }

            function getTitleMapCategory(arrBuilding) {
                if (!arrBuilding || (arrBuilding.length > 0 && !arrBuilding[0]) || !($scope.form[5].titleMap || $scope.form[6].titleMap))
                    return;
                //for category
                categorysListTemp = categorysList.filter(function(item) {
                    // return (($scope.model.CompanyID && item.CompanyID.search($scope.model.CompanyID) > -1) && (arrBuilding.indexOf(item.BuildingID) > -1)) || item.CompanyID == "";
                    if (item.CompanyID == "")
                        return true;
                    if (!$scope.model.CompanyID)
                        return false;
                    if (!arrBuilding || arrBuilding.length == 0)
                        return false;
                    var bExisted = false;
                    if (item.CompanyID.search($scope.model.CompanyID) > -1)
                        bExisted = true;
                    if (bExisted) {
                        var ex = false;
                        for (var i = 0; i < arrBuilding.length; i++) {
                            var it = arrBuilding[i];
                            if (it && it.value == item.BuildingID) {
                                ex = true;
                                break;
                            }
                        }

                    }
                    return bExisted && ex;
                });

                $scope.form[6].titleMap = categorysListTemp;

                //remove item not in BuildingID
                var arrNewCategory = [];
                if ($scope.form[6].options.scope.$$childHead.$select.selected) {
                    for (var i = 0; i < $scope.form[6].options.scope.$$childHead.$select.selected.length; i++) {
                        // if ($scope.model.CategoryList) {
                        //     for (var i = 0; i < $scope.model.CategoryList.length; i++) {
                        var it = $scope.form[6].options.scope.$$childHead.$select.selected[i];
                        var temp;
                        for (var k in categorysList) {
                            if (categorysList[k].value == it.value) {
                                temp = categorysList[k];
                                break;
                            }
                        }
                        var bExisted = false;
                        for (var j = 0; j < arrBuilding.length; j++) {
                            var it1 = arrBuilding[j];
                            if (it1 && it1.value == temp.BuildingID) {
                                arrNewCategory.push(it);
                                break;
                            }
                        }
                    }
                    setItemMulSelect($scope.form[6], 'CategoryList', arrNewCategory);
                }

                // resetMulSelect($scope.form[6], 'CategoryList');
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
                formCtr.options.scope.select_model.selected = "";
                formCtr.options.scope.populateTitleMap($scope.form[2]);
                if ($scope.model[modelName])
                    delete $scope.model[modelName];
            }

            function setItemMulSelect(formCtr, modelName, arrayItem) {
                setTimeout(function() {
                    formCtr.options.scope.$apply(function() {
                        formCtr.options.scope.$$childHead.$select.selected = arrayItem;
                    });
                }, 0);

                if ($scope.model[modelName]) {
                    $scope.model[modelName] = [];
                    for (var i = 0; i < arrayItem; i++) {
                        $scope.model[modelName].push(arrayItem[i].value);
                    }
                }
            }

            function resetMulSelect(formCtr, modelName, arrayItem) {
                setTimeout(function() {
                    formCtr.options.scope.$apply(function() {
                        formCtr.options.scope.$$childHead.$select.selected = [];
                        if (arrayItem) {
                            arrayItem = [];
                            formCtr.titleMap = arrayItem;
                        }
                    });
                }, 0);

                // formCtr.options.scope.$$childHead.$selectMultiple.selected = undefined;
                // formCtr.options.scope.$$childHead.$selectMultiple.refreshComponent();
                if ($scope.model[modelName])
                    $scope.model[modelName] = [];

                if (arrayItem) {
                    arrayItem = [];
                    formCtr.titleMap = arrayItem;
                }
            }

        }
    ]);