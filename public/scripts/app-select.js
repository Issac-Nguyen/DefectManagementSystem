/*global angular */
"use strict";

/**
 * The main app module
 * @name testApp
 * @type {angular.Module}
 */

var testApp = angular.module("testApp", ["schemaForm", "mgcrea.ngStrap", 
    "pascalprecht.translate", "ui.select", "mgcrea.ngStrap.select"

]);

testApp.controller("appController", ["$scope", "$http",
    function($scope, $http) {

        $scope.callBackSD = function(options, search) {
            if (search) {
                console.log("Here the select lis could be narrowed using the search value: " + search.toString());
                return [{
                    value: "value1",
                    name: "text1"
                }, {
                    value: "value2",
                    name: "text2"
                }, {
                    value: "value3",
                    name: "Select dynamic!"
                }].filter(function(item) {
                    return (item.name.search(search) > -1)
                });
            } else {
                return [{
                    value: "value1",
                    name: "text1"
                }, {
                    value: "value2",
                    name: "text2"
                }, {
                    value: "value3",
                    name: "Select dynamic!"
                }];

            }
            // Note: Options is a reference to the original instance, if you change a value,
            // that change will persist when you use this form instance again.
        };
        $scope.callBackUI = function(options) {
            return [{
                "value": "value1",
                "name": "text1",
                "category": "value1"
            }, {
                "value": "value2",
                "name": "text2",
                "category": "value1"
            }, {
                "value": "value3",
                "name": "So this is the next item",
                "category": "value2"
            }, {
                "value": "value4",
                "name": "The last item",
                "category": "value1"
            }];
            // Note: Options is a reference to the original instance, if you change a value,
            // that change will persist when you use this form instance again.
        };
        $scope.callBackMSD = function(options) {
            return [{
                value: "value1",
                name: "text1"
            }, {
                value: "value2",
                name: "text2"
            }, {
                value: "value3",
                name: "Multiple select dynamic!"
            }];
            // Note: Options is a reference to the original instance, if you change a value,
            // that change will persist when you use this form instance again.
        };

        $scope.callBackMSDAsync = function(options) {
            // Note that we got the url from the options. Not necessary, but then the same callback function can be used
            // by different selects with different parameters.

            // The asynchronous function must always return a httpPromise
            return $http.get(options.urlOrWhateverOptionIWant);
        };

        $scope.stringOptionsCallback = function(options) {
            // Here you can manipulate the form options used in a http_post or http_get
            // For example, you can use variables to build the URL or set the parameters, here we just set the url.
            options.httpPost.url = "test/testdata.json";
            // Note: This is a copy of the form options, edits here will not persist but are only used in this request.
            return options;
        };

        $scope.schema = {
            type: "object",
            title: "Select",
            properties: {
                uiselect: {
                    title: "Single select for UI-select",
                    type: "string",
                    description: "This one is using UI-select, single selection. Fetches lookup values(titleMap) from a callback."
                },
            }
        };

        $scope.form = [

            {
                "key": "uiselect",
                "type": "uiselect",
                "placeholder": "not set yet..",
                "options": {
                    "callback": "callBackSD"
                }
            },

            {
                type: "submit",
                style: "btn-info",
                title: "OK"
            }

        ];
        $scope.model = {};
        $scope.model.select = "value1";
        $scope.model.multiselect = ["value2", "value1"];
        $scope.model.uiselect = "value1";
        $scope.model.uiselectmultiple = ["value1", "value2"];


        $scope.model.priorities = {
            "priority": [{
                "value": "DOG"
            }, {
                "value": "DOG"
            }, {
                "value": "FISH"
            }]
        };

        $scope.submitted = function(form) {
            $scope.$broadcast("schemaFormValidate");
            console.log($scope.model);
        };
    }
]);