'use strict';

angular.module('angularTokenAuthApp.filters', [])
    .filter('true_false', function() {
        return function(text, length, end) {
            if (text) {
                return 'Yes';
            }
            return 'No';
        }
    })
    .filter('dateString', function() {
        return function(text, length, end) {
            if(text)
            	return moment(text).format('DD/MM/YYYY');
            return '';
        }
    })
    .filter('password', function() {
        return function(text, length, end) {
            if(text) {
                var stringPwd = '';
                for(var i = 0; i < text.length; i++) {
                    stringPwd += '*';
                }
                return stringPwd;
            }
            return '';
        }
    });