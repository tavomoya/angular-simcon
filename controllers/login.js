'use strict';

var app = angular.module('simcon.authorization');

app.controller('LoginCtrl', function ($scope, $rootScope, $http, $location, $window, md5, Authorization, dialogs) {

	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/************* Constantes y Variables *************/

	$rootScope.isAuthenticated = $rootScope.isAuthenticated || false;
	$scope.wellcome = '';
	$scope.message = '';
	console.log('Hola :)')
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
		console.log('Yei :3 ', $scope.user);
		authorization.login($scope.user).then(function (obj) {
			
			$scope.user.username = angular.copy($scope.email);
			$scope.user.password = angular.copy($scope.password);
			console.log(obj)
			$rootScope.userData = obj.user;
			$window.sessionStorage.user = JSON.stringify($rootScope.userData);
			$window.sessionStorage.token = obj.token;
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

		var dialog = dialogs.create('bower_components/simcon-authorization/partials/forgetPassword.html', 'ForgetPassCtrl');
		dialog.result.then(function (obj) {
			console.log('Cambie la password ->');
		}, function (err) {
			console.log('No pude cambiar el password');
		}); 

	}
	
});