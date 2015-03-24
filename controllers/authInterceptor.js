'use strict';

var app = angular.module('simcon.authorization');

//AuthInterceptor
app.factory('authInterceptor', function ($rootScope, $q, $window, $location) {
	return {
		request: function (config) {
			config.headers = config.headers || {};
			if ($window.sessionStorage.token) {
				config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
			} else {
				
			}
			
			return config;
		},
		responseError: function (rejection) {
			if (rejection.status === 401) {
				// if not authorized access
				console.log('----- rejection status -----');
				console.log(rejection.status);
				$rootScope.logout();
				//$location.path('/login');
			}
			return $q.reject(rejection);
		}
	};

});

//Config
app.config(function ($httpProvider) {
	$httpProvider.interceptors.push('authInterceptor');
});