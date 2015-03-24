'use strict';

var app = angular.module('simcon.authorization');

app.factory('Authorization', function ($http, $rootScope, Base, $q, Official) {

	
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/************* Constantes y Variables privadas *************/
	var hasProp = Object.prototype.hasOwnProperty,
		Authorization;
	
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/************* Funciones privadas *************/

	//1) Funcion para extender de la clase base
	var extend = function (child, parent) {
		var key;
		for (key in parent) {
			if (hasProp.call(parent, key)) { child[key] = parent[key]; }
		}

		function Ctor() {
			this.constructor = child;
		}

		Ctor.prototype = parent.prototype;

		child.prototype = new Ctor();

		child.super = parent.prototype;

		return child;
	};

	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/************* Extender de base *************/
	
	extend(Authorization, Base);


	function Authorization(propValues) {
		Authorization.super.constructor.apply(this, arguments);

		this.baseApiPath = "/auth";
	}

	Authorization.properties = function () {
		var u = {

		};

		return u;
	};


	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/************* Funciones propias de Documents *************/
	
	//Validaciones de las instancias de esta clase
	Authorization.prototype.validate = function () {
		return true;
	};

	//Sobreescribir la funcion del save para utilizar la validacion es esta clase
	Authorization.prototype.save = function () {
		if (this.validate()) {
			return Authorization.super.save.call(this);
		}
	};

	Authorization.prototype.login = function (user) {
		var deferred = $q.defer();

		$http.post(this.baseApiPath + '/login', {
			username: user.email, 
			pass: user.password
		}).then(function (obj) {
			console.log('el obj', obj);
			obj.data.user = new Official(obj.data.user);
			deferred.resolve(obj.data);
		}, function (err) {
			deferred.reject({
				err: err,
				message: 'Ocurrio un error en el login'
			});
		});

		return deferred.promise;
	}

	Authorization.prototype.changePassword = function (userId, newPassword) {
		var deferred = $q.defer();

		$http.post(this.baseApiPath + '/changePassword', {obj: {
			id: userId,
			newPassword: newPassword }
		}).then(function (obj) {
			console.log('El obj que trajo change password', obj);
			deferred.resolve(obj);
		}, function (err) {
			console.log('Hubo un error', err);
			deferred.reject({
				err: err,
				message: 'Ocurrio un error actualizando el password'
			});
		});

		return deferred.promise;
	};

	Authorization.prototype.logout = function() {
		$rootScope.isAuthenticated = false;
		$rootScope.userData = [];
		$scope.message = "";
		$scope.wellcome = "";
		delete $window.sessionStorage.token;
		delete $window.sessionStorage.user;
		$location.path('/login');
	};

	Authorization.prototype.signUp = function() {
		var deferred = $q.defer();

		$http.post(this.baseApiPath + '/signup', {obj: this})
			.then(function (obj) {
				deferred.resolve(obj);
			}, function (err) {
				deferred.reject({
					error: err,
					message: 'Ocurrio un error en el registro, contacte su proveedor'
				});
			});
		
		return deferred.promise;
	};

	Authorization.prototype.forgetPassword = function(email) {
		var deferred = $q.defer();

		$http.post(this.baseApiPath + '/forgetPassword', {obj: email})
			.then(function (obj) {
				deferred.resolve(obj);
			}, function (err) {
				deferred.reject({
					error: err,
					message: 'Ocurrio un error actualizando el password'
				});
			});

		return deferred.promise;
	};

	Authorization.prototype.search = function(id) {
		var deferred = $q.defer();

		$http.post('/api/auth/search/'+id).success(function (data, status) {
			deferred.resolve(data);
		});

		return deferred.promise;
	};


	return Authorization;
});