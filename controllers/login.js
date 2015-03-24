'use strict';

var app = angular.module('simcon.authorization');

app.controller('LoginCtrl', function ($scope, $rootScope, $http, $location, $window, md5, Authorization, dialogs) {

	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/************* Constantes y Variables *************/

	$rootScope.isAuthenticated = $rootScope.isAuthenticated || false;
	$scope.wellcome = '';
	$scope.message = '';

	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/************* Objetos *************/

	//1) Objeto para crear un nuevo usuario
	$scope.user = {
		username: '',
		password: ''
	};

	var authorization = new Authorization();

	$scope.submit = function () {
		
		$scope.user.password = md5.createHash($scope.password);
		$scope.user.username = $scope.email.toLowerCase();

		authorization.login($scope.user).then(function (obj) {
			
			$scope.user.username = angular.copy($scope.email);
			$scope.user.password = angular.copy($scope.password);
			console.log(obj)
			$rootScope.userData = obj.data.user;
			$window.sessionStorage.user = JSON.stringify($rootScope.userData);
			$window.sessionStorage.token = obj.data.token;
			$window.sessionStorage.isAuthenticated = true;
			$rootScope.isAuthenticated = true;
			$location.path('/');

		}, function (err) {
			console.log('No funcione :(', err);
			$rootScope.isAuthenticated = false;
			$window.sessionStorage.isAuthenticated = false;
			$scope.message = "Nombre de usuario o Password inválido";
			$scope.email = "";
			$scope.password = "";
		});

	};

	$scope.forgetPassword = function () {

		var dialog = dialogs.create('partials/forgetPassword.html', 'ForgetPassCtrl');
		dialog.result.then(function (obj) {
			console.log('Cambie la password ->');
		}, function (err) {
			console.log('No pude cambiar el password');
		}); 

	}
	
});