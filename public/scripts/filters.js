'use strict';

angular.module('angularTokenAuthApp.filters', [])
    .filter('true_false', function() {
        return function(text, length, end) {
            if (text) {
                return 'No';
            }
            return 'Yes';
        }
    });