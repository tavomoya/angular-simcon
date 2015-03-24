'use strict';

var app = angular.module('simcon.authorization');

app.controller('ForgetPassCtrl', function($rootScope, $scope, $modalInstance, $timeout, data, Authorization, md5) {

  var authorization = new Authorization();

  $scope.mailForgetPassword = function () {

    authorization.forgetPassword($scope.mail).then(function (data) {
      console.log('Funciono el forget password');
      $modalInstance.close(data);
    }, function (err) {
      console.log('No funciono el forget password');
    });

  }

  $scope.cancel = function() {
    console.log('Cancelando...');
    $modalInstance.dismiss('canceled');
  };


});
