'use strict';

angular.module('angularTokenAuthApp.controllers')
.controller('LoginController', 
  ['$scope', '$http', '$state', 'Auth', 'ACCESS_LEVELS', 
  function ($scope, $http, $state, Auth, ACCESS_LEVELS) {

  $scope.signinData = {
    grantType: 'password'
  }; 
  $scope.loginForm = {};

  $scope.signin = function () {
    $http
    .post('/signin', $scope.signinData)
    .success(function (data, status, headers, config) {
      var user = {};
      user.local = {};
      user.userId = data.user.id;
      user.access_token = data.access_token;
      user.role = ACCESS_LEVELS.user; 
      user.local.username = data.user.local.username;
      user.local.password = data.user.local.password;
      Auth.setUser(user);
      $state.go('user.top');
    })
    .error(function (data, status, headers, config) {
      $scope.loginForm.serverError = {
        message : 'Error: Attempt failed'
      };
      if (data.message) {
        $scope.loginForm.serverError.message = data.message;
      }
    });
  };
  // $scope.signinWithFacebook = function () {
  //   facebook.login().then(function (result) {
  //     var data = {
  //       grantType: 'facebookToken',
  //       facebookToken: result.authResponse.accessToken
  //     };
  //     // exchange access token with facebook token
  //     $http
  //     .post('/api/access_token', data)
  //     .success(function (data, status, headers, config) {
  //       var user = {};
  //       user.userId = data.user.id;
  //       user.access_token = data.access_token;
  //       user.role = ACCESS_LEVELS.user; 
  //       Auth.setUser(user);
  //       $state.go('user.top');
  //     })
  //     .error(function (data, status, headers, config) {
  //       $scope.loginForm.serverError = {
  //         message : 'Error: Attempt failed'
  //       };
  //       if (data.message) {
  //         $scope.loginForm.serverError.message = data.message;
  //       }
  //     });
  //   });
 

  // };
}]);
