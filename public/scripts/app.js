'use strict';

angular.module('angularTokenAuthApp', ['ui.router', 'ngAnimate',
    'ngCookies',
    'angularTokenAuthApp.directives',
    'angularTokenAuthApp.controllers',
    'angularTokenAuthApp.services',
    'angularTokenAuthApp.filters',
    'schemaForm',
    'ui.grid',
    'ui.grid.pagination',
    "pascalprecht.translate", "ui.select",
])
    .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider', 'ACCESS_LEVELS',
        function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, ACCESS_LEVELS) {

            //================================================
            // Route configurations 
            //================================================

            // Public routes
            $stateProvider
                .state('public', {
                    abstract: true,
                    template: "<div ui-view></div>",
                    data: {
                        accessLevel: ACCESS_LEVELS.pub
                    }
                })
                .state('public.login', {
                    url: '/login',
                    templateUrl: '/views/partials/login.html',
                    controller: 'LoginController',
                })
                .state('public.register', {
                    url: '/register',
                    templateUrl: '/views/partials/register.html',
                    controller: 'RegisterController'
                });

            // Regular user routes
            $stateProvider
                .state('user', {
                    abstract: true,
                    template: "<div ui-view></div>",
                    data: {
                        accessLevel: ACCESS_LEVELS.user
                    }
                })
                .state('user.top', {
                    url: '/tops',
                    templateUrl: '/views/top.html',
                    controller: 'HomeController',
                    resolve: {
                        tops: function($http) {
                            return $http({
                                    method: 'GET',
                                    url: '/webapi/tops'
                                })
                                .then(function(data) {
                                    return data.data;
                                });
                        },
                    }
                })
                .state('user.company', {
                    url: '/companys',
                    templateUrl: '/views/company.html',
                    controller: 'CompanyController',
                    resolve: {
                        companys: function($http) {
                            // return $http({
                            //         method: 'GET',
                            //         url: '/webapi/companys'
                            //     })
                            //     .then(function(data) {
                            //         return data.data;
                            //     });
                            return [];
                        },
                    }
                })
                .state('user.building', {
                    url: '/building',
                    templateUrl: '/views/building.html',
                    controller: 'BuildingController',
                    resolve: {
                        companys: function($http) {
                            return $http({
                                    method: 'GET',
                                    url: '/webapi/companys'
                                })
                                .then(function(data) {

                                    data.data.map(function(item) {
                                        item.name = item.Name;
                                        item.value = item.id;
                                    });

                                    return data.data;
                                });
                        },
                        buildings: function($http) {
                            // return $http({
                            //         method: 'GET',
                            //         url: '/webapi/buildings'
                            //     })
                            //     .then(function(data) {
                            //         return data.data;
                            //     });
                            return [];
                        },
                    }
                })
                .state('user.department', {
                    url: '/department',
                    templateUrl: '/views/department.html',
                    controller: 'DepartmentController',
                    resolve: {
                        buildings: function($http) {
                            return $http({
                                    method: 'GET',
                                    url: '/webapi/buildings'
                                })
                                .then(function(data) {

                                    data.data.map(function(item) {
                                        item.name = item.Name;
                                        item.value = item.id;
                                    });

                                    return data.data;
                                });
                        },
                        departments: function($http) {
                            // return $http({
                            //         method: 'GET',
                            //         url: '/webapi/departments'
                            //     })
                            //     .then(function(data) {
                            //         return data.data;
                            //     });
                            return [];
                        },
                    }
                })
                .state('user.subDepartment', {
                    url: '/sub-department',
                    templateUrl: '/views/subdepartment.html',
                    controller: 'SubDepartmentController',
                    resolve: {
                        subdepartments: function($http) {
                            // return $http({
                            //         method: 'GET',
                            //         url: '/webapi/subdepartments'
                            //     })
                            //     .then(function(data) {
                            //         return data.data;
                            //     });
                            return [];
                        },
                        departments: function($http) {
                            return $http({
                                    method: 'GET',
                                    url: '/webapi/departments'
                                })
                                .then(function(data) {

                                    data.data.map(function(item) {
                                        item.name = item.Name;
                                        item.value = item.id;
                                    });

                                    return data.data;
                                });
                        },
                    }
                })
                .state('user.category', {
                    url: '/category',
                    templateUrl: '/views/category.html',
                    controller: 'CategoryController',
                    resolve: {
                        buildings: function($http) {
                            return $http({
                                    method: 'GET',
                                    url: '/webapi/buildings'
                                })
                                .then(function(data) {

                                    data.data.map(function(item) {
                                        item.name = item.Name;
                                        item.value = item.id;
                                    });

                                    return data.data;
                                });
                        },
                        categorys: function($http) {
                            // return $http({
                            //         method: 'GET',
                            //         url: '/webapi/categorys'
                            //     })
                            //     .then(function(data) {
                            //         return [];
                            //     });
                            return [];
                        },
                        companys: function($http) {
                            return $http({
                                    method: 'GET',
                                    url: '/webapi/companys'
                                })
                                .then(function(data) {

                                    data.data.map(function(item) {
                                        item.name = item.Name;
                                        item.value = item.id;
                                    });

                                    return data.data;
                                });
                        },
                    }
                })
                .state('user.subCategory', {
                    url: '/sub-category',
                    templateUrl: '/views/subcategory.html',
                    controller: 'SubCategoryController',
                    resolve: {
                        subcategorys: function($http) {
                            // return $http({
                            //         method: 'GET',
                            //         url: '/webapi/subcategorys'
                            //     })
                            //     .then(function(data) {
                            //         return data.data;
                            //     });
                            return [];
                        },
                        categorys: function($http) {
                            return $http({
                                    method: 'GET',
                                    url: '/webapi/categorys'
                                })
                                .then(function(data) {
                                    // var returnArr = [];
                                    // for (var i = 0; i < data.data.length; i++) {
                                    //     var obj = {};
                                    //     var item = data.data[i];
                                    //     obj.name = item.Name;
                                    //     obj.value = item.id;
                                    //     returnArr.push(obj);
                                    // }
                                    data.data.map(function(item) {
                                        item.name = item.Name;
                                        item.value = item.id;
                                    });
                                    return data.data;
                                });
                        },
                    }
                })
                .state('user.floor', {
                    url: '/floor',
                    templateUrl: '/views/floor.html',
                    controller: 'FloorController',
                    resolve: {
                        buildings: function($http) {
                            return $http({
                                    method: 'GET',
                                    url: '/webapi/buildings'
                                })
                                .then(function(data) {

                                    data.data.map(function(item) {
                                        item.name = item.Name;
                                        item.value = item.id;
                                    });

                                    return data.data;
                                });
                        },
                        floors: function($http) {
                            // return $http({
                            //         method: 'GET',
                            //         url: '/webapi/floors'
                            //     })
                            //     .then(function(data) {
                            //         return data.data;
                            //     });
                            return [];
                        },
                    }
                })
                .state('user.zone', {
                    url: '/zone',
                    templateUrl: '/views/zone.html',
                    controller: 'ZoneController',
                    resolve: {
                        buildings: function($http) {
                            return $http({
                                    method: 'GET',
                                    url: '/webapi/buildings'
                                })
                                .then(function(data) {

                                    data.data.map(function(item) {
                                        item.name = item.Name;
                                        item.value = item.id;
                                    });

                                    return data.data;
                                });
                        },
                        zones: function($http) {
                            // return $http({
                            //         method: 'GET',
                            //         url: '/webapi/zones'
                            //     })
                            //     .then(function(data) {
                            //         return data.data;
                            //     });
                            return [];
                        },
                    }
                })
                .state('user.subZone', {
                    url: '/sub-zone',
                    templateUrl: '/views/subzone.html',
                    controller: 'SubZoneController',
                    resolve: {
                        subzones: function($http) {
                            // return $http({
                            //         method: 'GET',
                            //         url: '/webapi/subzones'
                            //     })
                            //     .then(function(data) {
                            //         return data.data;
                            //     });
                            return [];
                        },
                        zones: function($http) {
                            return $http({
                                    method: 'GET',
                                    url: '/webapi/zones'
                                })
                                .then(function(data) {

                                    data.data.map(function(item) {
                                        item.name = item.Name;
                                        item.value = item.id;
                                    });

                                    return data.data;
                                });
                        },
                    }
                })
                .state('user.technician', {
                    url: '/technicians',
                    templateUrl: '/views/technician.html',
                    controller: 'TechnicianController',
                    resolve: {
                        technicians: function() {
                            return [];
                        },
                        companys: function($http) {
                            return $http({
                                    method: 'GET',
                                    url: '/webapi/companys'
                                })
                                .then(function(data) {

                                    data.data.map(function(item) {
                                        item.name = item.Name;
                                        item.value = item.id;
                                    });

                                    return data.data;
                                });
                        },
                        buildings: function($http) {
                            return $http({
                                    method: 'GET',
                                    url: '/webapi/buildings'
                                })
                                .then(function(data) {
                                    data.data.map(function(item) {
                                        item.name = item.Name;
                                        item.value = item.id;
                                    });

                                    return data.data;
                                });
                        },
                        categorys: function($http) {
                            return $http({
                                    method: 'GET',
                                    url: '/webapi/categorys'
                                })
                                .then(function(data) {
                                    data.data.map(function(item) {
                                        item.name = item.Name;
                                        item.value = item.id;
                                    });
                                    return data.data;
                                });
                        },
                    }
                });

            $locationProvider.html5Mode(true);
            $urlRouterProvider.otherwise('/tops');


            //================================================
            // An interceptor for AJAX errors
            //================================================
            var interceptor = ['$q', '$rootScope', '$injector', 'Auth',
                function($q, $rootScope, $injector, Auth) {
                    return {
                        request: function(request) {
                            if (request.url.indexOf('/webapi/') >= 0) {
                                request.params = request.params || {};
                                request.params.access_token = Auth.getToken();
                            }
                            return request;
                        },
                        responseError: function(rejection) {
                            if (rejection.status === 401) {
                                var $state = $injector.get('$state');
                                $state.go('public.login');
                            }
                            return $q.reject(rejection);
                        }
                    };
                }
            ];
            $httpProvider.interceptors.push(interceptor);

        }
    ])
    .run(['$rootScope', '$state', 'Auth',
        function($rootScope, $state, Auth) {
            $rootScope.$on('$stateChangeStart',
                function(event, toState, toParams, fromState, fromParams) {
                    if (!Auth.isAuthorized(toState.data.accessLevel)) {
                        if (Auth.isLoggedIn()) {
                            // the user is logged in, but does not have permissions
                            // to view the view (not authorized) 
                            event.preventDefault();
                            $state.go('user.top');
                        } else {
                            event.preventDefault();
                            $state.go('public.login');
                        }
                    } else if (toState.name == "public.login") {
                        if (Auth.isLoggedIn()) {
                            event.preventDefault();
                            $state.go('user.top');
                        }

                    }
                });
        }
    ]);