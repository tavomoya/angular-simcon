'use strict';

var app = angular.module('simcon.authorization');

app.controller('ChngPassCtrl', function($rootScope, $modalInstance, data, $routeParams, $scope, $location, $timeout, Authorization, md5) {

  var authorization = new Authorization();
  var oldPass;

  $scope.savePass = function(actual, newP, confirm) {
    oldPass = angular.copy(actual);
    oldPass = md5.createHash(oldPass);    

    if (oldPass == data.account.password) {
      if (newP == confirm) {
        authorization.changePassword(data._id, newP)
          .then(function (obj) {
            console.log('Cambio la password ->', obj);
            $modalInstance.dismiss(obj);
          }, function (err) {
            console.log('No pudo cambiar el password', err);
          }); 

      } else {
        $rootScope.showMessage(0, 'Las contraseñas deben ser iguales', 2000);
      }

    } else {
      $rootScope.showMessage(0, 'La contraseña insertada no coincide con la contraseña actual', 2000);
    }

  }

  $scope.changePass = function (actual, newP, confirm) {
    authorization.searchByToken($routeParams.token)
      .then(function (data) {
        oldPass = angular.copy(actual);
        oldPass = md5.createHash(oldPass);    
        if (oldPass == data.data.account.password) {
          if (newP == confirm) {
            authorization.changePassword(data.data._id, newP)
              .then(function (obj) {
                console.log('Cambio la password ->', obj);
                $location.path('/login');
                // $modalInstance.dismiss(obj);
              }, function (err) {
                console.log('No pudo cambiar el password', err);
              }); 

          } else {
            $rootScope.showMessage(0, 'Las contraseñas deben ser iguales', 2000);
          }

        } else {
          $rootScope.showMessage(0, 'La contraseña insertada no coincide con la contraseña actual', 2000);
        }

      }, function (error) {
        console.log('No funciono :/');
      });

  }

  $scope.cancel = function() {
    console.log('Cancelando...');
    $modalInstance.dismiss('canceled');
  };


});
