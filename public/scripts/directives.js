'use strict';

angular.module('angularTokenAuthApp.directives', [])
.directive('focusMe', function ($timeout) {    
    return {    
        link: function (scope, element, attrs, model) {                
            $timeout(function () {
                element[0].focus();
            });
        }
    };
});