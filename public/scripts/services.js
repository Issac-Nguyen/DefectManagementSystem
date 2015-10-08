'use strict';

angular.module('angularTokenAuthApp.services', [])
    .constant('ACCESS_LEVELS', {
        pub: 1,
        user: 2
    })
    .factory('Auth', ['$cookieStore', 'ACCESS_LEVELS',
        function($cookieStore, ACCESS_LEVELS) {

            var currentUser = $cookieStore.get('user');

            return {
                isAuthorized: function(lvl) {
                    var userRole = currentUser ? currentUser.role : ACCESS_LEVELS.pub;
                    return userRole >= lvl;
                },
                setUser: function(user) {
                    if (!user.role || user.role < 0) {
                        user.role = ACCESS_LEVELS.pub;
                    }
                    currentUser = user;
                    $cookieStore.put('user', currentUser);
                },
                isLoggedIn: function() {
                    return currentUser ? true : false;
                },
                getUser: function() {
                    return currentUser;
                },
                getId: function() {
                    return currentUser ? currentUser.id : null;
                },
                getToken: function() {
                    return currentUser ? currentUser.access_token : '';
                },
                logout: function() {
                    $cookieStore.remove('user');
                    currentUser = null;
                }
            };
        }
    ])
    .factory('Utils', [

        function() {
            function getDefaultValueFromSchema(schema) {
                var schemaProp = schema.properties;
                var objDefaultVl = {};
                for (var i in schemaProp) {
                    if (schemaProp[i].default !== 'undefined') {
                        objDefaultVl[i] = schemaProp[i].default;
                    }
                }
                return objDefaultVl;
            }

            function getIndex(arr, vl) {
                for (var i = 0; i < arr.length; i++) {
                    var item = arr[i];
                    if (item.id === vl.id) {
                        return i;
                    }
                }
            }

            function templateTrueFalseCell() {
                return '<div class="ngCellText">{{row.getProperty(col.field) | true_false}}</div>';
            }

            return {
                getDefaultValueFromSchema: getDefaultValueFromSchema,
                getIndex: getIndex,
                templateTrueFalseCell: templateTrueFalseCell
            }
        }
    ]);