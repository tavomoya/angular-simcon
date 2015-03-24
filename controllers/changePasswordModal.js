'use strict';

var app = angular.module('simcon.authorization');

app.controller('ChngPassCtrl', function($rootScope, $scope, $modalInstance, $timeout, data, Authorization, md5) {

  var authorization = new Authorization();

  $scope.savePass = function(actual, newP, confirm) {
    oldPass = angular.copy(actual);
    oldPass = md5.createHash(oldPass);    

    if (oldPass == data.authorization.password) {
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

  $scope.cancel = function() {
    console.log('Cancelando...');
    $modalInstance.dismiss('canceled');
  };


});
