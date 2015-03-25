'use strict';

var app = angular.module('simcon.authorization');

app.controller('SessionCtrl', function ($scope, $rootScope, $timeout, $location,$window, $http, Authorization) {

	if (!$window.sessionStorage.user) {
		$rootScope.isAuthenticated = false;
		$rootScope.userData = {};
	} else {
		$rootScope.isAuthenticated = true;

		if (!$rootScope.userData) {
			$rootScope.userData = JSON.parse($window.sessionStorage.user);

			var authorization = new Authorization();

			authorization.search($rootScope.userData._id)
				.then(function (obj) {
					console.log('This is the user', obj);
					$rootScope.userData = obj.data[0] ? obj.data[0] : obj.data;
				}, function (err) {
					console.log('Ocurrio un error trayendo al usuario');
				});


		};
	}

	$rootScope.$on("$routeChangeStart", function () {

		if (!$window.sessionStorage.isAuthenticated && ($location.path() != '/register' && $location.path().substr(0, 15) != "/changepassword" && $location.path().substr(0, 14) != "/confirm/email")) {
			$location.path('/login');
		}

	});
		
});