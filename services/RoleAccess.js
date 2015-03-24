'use strict';

var app = angular.module('simcon.authorization');

app.factory('RoleAccess', function ($http, $rootScope, Base, $q) {

	
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/************* Constantes y Variables privadas *************/
	var hasProp = Object.prototype.hasOwnProperty,
		RoleAccess;
	
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
	
	extend(RoleAccess, Base);


	function RoleAccess(propValues) {
		RoleAccess.super.constructor.apply(this, arguments);
		
		this.baseApiPath = "/roleAccess";
	}

	RoleAccess.properties = function () {
		var u = {};

		return u;
	};

	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/************* Funciones propias de Documents *************/
	
	//Validaciones de las instancias de esta clase
	RoleAccess.prototype.validate = function () {
		return true;
	};

	//Sobreescribir la funcion del save para utilizar la validacion es esta clase
	RoleAccess.prototype.save = function () {
		if (this.validate()) {
			return RoleAccess.super.save.call(this);
		}
	};

	return RoleAccess;
});