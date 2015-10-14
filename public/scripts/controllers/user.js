'use strict';

angular.module('angularTokenAuthApp.controllers')
    .controller('UserController', ['$scope', '$state', '$q', '$http', 'Utils', 'Auth', '$modal', 'uiGridConstants',
        function($scope, $state, $q, $http, Utils, Auth, $modal, uiGridConstants) {
            $scope.model = Auth.getUser();

            $scope.saveProfile = function() {
                var data = {
                    id: $scope.model.userId,
                    password: $scope.model.local.password
                }
                $http.post('/webapi/updateUser', {
                    data
                }).success(function(data, status, headers, config) {
                    console.log(data);
                    $scope.model.local.password = data.local.password;
                }).error(function(data, status, headers, config) {
                    console.log(data);
                })
            }

            $scope.logout = function() {
                Auth.logout();
                $state.go('public.login');
            };

        }
    ]);