'use strict';

var app = angular.module('simcon.authorization');

app.controller('ChangePasswordCtrl', function ($scope, $rootScope, dialogs) {


	$scope.changePassword = function () {
		console.log('Funcion de changePassword')
		var dialog = dialogs.create('partials/changePassword.html', 'ChngPassCtrl', $rootScope.userData, 'sm');
		dialog.result.then(function (obj) {
			console.log('Cambie la password ->');
		}, function (err) {
			console.log('No pude cambiar el password');
		}); 

	}

	$scope.changePassword();

});