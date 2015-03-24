'use strict';

var app = angular.module('simcon.authorization');

app.factory('Base', function ($http, $q) {

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/************* Constructor *************/
	//Constructor

	var Base = function (propValues) {
		//Not allow instance of the base class
		if (this.constructor.name === "Base") {
			throw "The class cannot be instantiated and is only meant to be extended by other classes.";
		}
		//Assign properties or instantiate them
		this.assignProperties(propValues);
	};

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/************* Funciones del Service *************/

	//1) Find: Get data and instantiate new objects for existing records from a REST API
	Base.prototype.find = function (params) {
		var deferred = $q.defer(),
			_this = this.constructor;
		if (params === null || params === undefined) {
			params = {};
		}
		$http.get(this.baseApiPath, params).success(function (data, status, headers, config) {
			var response = {},
				data = data.data;

			//Create a new object of the current class (or an array of them) and return it (or them)
			if (Array.isArray(data)) {
				response.data = data.map(function (obj) {
					return new _this(obj);
				});
				//Add "delete" method to results object to quickly delete objects and remove them from the results array
				response.delete = function (object) {
					object.delete().then(function () {
						return response.data.splice(response.data.indexOf(object), 1);
					});
				};
			} else {
				response = new _this(data);
			}
			return deferred.resolve(response);
		}).error(function (data, status, headers, config) {
			return deferred.reject(data);
		});
		return deferred.promise;
	};

	//2) Filter: Find documents filtered by params
	Base.prototype.filter = function (params) {
		var deferred = $q.defer(),
			_this = this.constructor;

		if (params) {
			/*if (typeof params == 'string') {
				try {
					params = JSON.parse(params);
				} catch (e) {
					console.log(e);
				}
			}*/

			$http.post(this.baseApiPath + '/filter', params).success(function (result, status, headers, config) {
				var response = {},
					data = result.data;
				//Create a new object of the current class (or an array of them) and return it (or them)
				if (Array.isArray(data)) {
					response.data = data.map(function (obj) {
						return new _this(obj);
					});
					//Add "delete" method to results object to quickly delete objects and remove them from the results array
					response.delete = function (object) {
						object.delete().then(function () {
							response.data.splice(response.data.indexOf(object), 1);
						});
					};
				} else {
					response = new _this(data);
				}
				return deferred.resolve(response);
			}).error(function (data, status, headers, config) {
				return deferred.reject(data);
			});
		} else {
			deferred.reject({
				res: 'Not ok',
				message: 'Debe introducir parametros de busqueda',
				data: {}
			});
		}
		return deferred.promise;
	};

	//3) Paginated Search: Find documents filtered, sorted, limited and skiped by params.
	Base.prototype.paginatedSearch = function (params) {
		var deferred = $q.defer(),
			_this = this.constructor;

		if (params) {
			$http.post(this.baseApiPath + '/paginated', params).success(function (data, status, headers, config) {
				var response = {},
					data = data.data;

				//Create a new object of the current class (or an array of them) and return it (or them)
				if (Array.isArray(data)) {
					response.data = data.map(function (obj) {
						return new _this(obj);
					});
					//Add "delete" method to results object to quickly delete objects and remove them from the results array
					response.delete = function (object) {
						object.delete().then(function () {
							response.data.splice(response.data.indexOf(object), 1);
						});
					};
				} else {
					response = new _this(data);
				}
				return deferred.resolve(response);
			}).error(function (data, status, headers, config) {
				return deferred.reject(data);
			});
		} else {
			deferred.reject({
				res: 'Not ok',
				message: 'Debe introducir los parametros para esta funcion!',
				data: {}
			});
		}
		return deferred.promise;
	};

	// Paginated Search: Find documents filtered, sorted, limited and skiped by params.
	Base.prototype.paginatedCount = function (params) {
		var deferred = $q.defer(),
			_this = this.constructor;

		if (params) {
			$http.post(this.baseApiPath + '/paginated/count', JSON.stringify(params)).success(function (data, status, headers, config) {
				var response = {},
					data = data.data;
				//Create a new object of the current class (or an array of them) and return it (or them)
				if (Array.isArray(data)) {
					response.data = data.map(function (obj) {
						return new _this(obj);
					});
					//Add "delete" method to results object to quickly delete objects and remove them from the results array
					response.delete = function (object) {
						object.delete().then(function () {
							response.data.splice(response.data.indexOf(object), 1);
						});
					};
				} else {
					if (typeof data == 'number') {
						data = {
							count: data
						};
					}
					response = new _this(data);
				}
				return deferred.resolve(response);
			}).error(function (data, status, headers, config) {
				return deferred.reject(data);
			});
		} else {
			deferred.reject({
				res: 'Not ok',
				message: 'Debe introducir los parametros para esta funcion!',
				data: {}
			});
		}
		return deferred.promise;
	};

	//4) SearchById: Search just one document
	Base.prototype.searchById = function (id) {
		var deferred = $q.defer(),
			_this = this.constructor;

		if (id) {

			$http.get(this.baseApiPath + '/search/' + id).success(function (result, status, headers, config) {
				var response = {},
					data = result.data;
				//Create a new object of the current class (or an array of them) and return it (or them)
				if (Array.isArray(data)) {
					response.data = data.map(function (obj) {
						return new _this(obj);
					});
					//Add "delete" method to results object to quickly delete objects and remove them from the results array
					response.delete = function (object) {
						object.delete().then(function () {
							response.data.splice(response.data.indexOf(object), 1);
						});
					};
				} else {
					response = new _this(data);
				}
				return deferred.resolve(response);
			}).error(function (data, status, headers, config) {
				return deferred.reject(data);
			});
		} else {
			deferred.reject({
				res: 'Not ok',
				message: 'Debe introducir parametros de busqueda',
				data: {}
			});
		}
		return deferred.promise;
	};

	/*
  Persist the current object's data by passing it to a REST API
  Dynamically switch between POST and PUT verbs if the current object has a populated _id property
  */
	Base.prototype.save = function (data) {
		var promise,
			_this = this,
			deferred = $q.defer();;

		if (data == null || data == undefined) {
			data = this.getDataForApi();
		}
		if (this.validate()) {
			console.log(' --- Save -> wsBase --- ');
			if (this._id != null && this._id != undefined) {
				promise = $http.put(_this.baseApiPath + "/" + this._id, {
					obj: data
					//,query: params
				});
			} else {
				console.log('\n\n ----- Insertat: ----- ');
				console.log(data);
				console.log(_this.baseApiPath);
				promise = $http.post(_this.baseApiPath, {
					obj: data
				});
			}
			promise.success(function (data, status, headers, config) {
				console.log('<<< Ws Base >>> Data: ');
				console.log(data);
				return deferred.resolve(_this.successCallback(data, status, headers, config));
			}).error(function (data, status, headers, config) {
				console.log('<<< Ws Base >> Error: ');
				console.log(data);
				return deferred.reject(_this.failureCallback(data, status, headers, config));
			});
		} else {
			deferred.reject(new Error('Invalid Object'));
		}
		return deferred.promise;
	};

	// Funcion para actualizar
	Base.prototype.update = function (data) {
		console.log(' ^^^^^^^^^^^^^^^ Clase Base -> Update ^^^^^^^^^^^^^', data);

		var promise,
			_this = this,
			deferred = $q.defer(),
			query = {
				'_id': this._id
			};

		if (data == null || data == undefined) {
			data = this.getDataForApi();
		}
		if (this.validate()) {
			if (this._id != null) {


				promise = $http.put(_this.baseApiPath, {
					query: query,
					obj: data
					//,query: params
				});
			}
			promise.success(function (data, status, headers, config) {
				return deferred.resolve(_this.successCallback(data, status, headers, config));
			}).error(function (data, status, headers, config) {
				return deferred.reject(_this.failureCallback(data, status, headers, config));
			});
		} else {
			deferred.reject(new Error('Invalid Object'));
		}
		return deferred.promise;
	};

	Base.prototype.delete = function (params) {
		var _this = this;
		if (params == null) {
			params = {};
		}
		var deferred = $q.defer();

		$http.delete("" + this.baseApiPath + "/" + this._id, {
			query: params
		}).success(function (data, status, headers, config) {
			console.log(data);
			return deferred.resolve(_this.successCallback(data, status, headers, config));
		}).error(function (data, status, headers, config) {
			return deferred.reject(_this.failureCallback(data, status, headers, config));
		});

		return deferred.promise;
	};

	Base.prototype.count = function (params) {
		var deferred = $q.defer(),
			that = this;

		params = params == null ? {} : params;
		$http.post("" + this.baseApiPath + "/count", params).success(function (data, status, headers, config) {
			return deferred.resolve(that.successCallback(data, status, headers, config));

		}).error(function (data, status, headers, config) {
			return deferred.reject(that.failureCallback(data, status, headers, config));
		});

		return deferred.promise;
	};

	Base.prototype.customSearch = function (qry, conf) {
		var deferred = $q.defer(),
			that = this.constructor,
			params = {},
			response = {},
			data;

		qry = qry == null ? {} : qry;
		conf = conf == null ? {} : conf;

		params.query = qry;
		params.conf = conf;

		$http.post(this.baseApiPath + "/customSearch", params).success(function (result, status, headers, config) {
			//Create a new object of the current class (or an array of them) and return it (or them)
			data = result.data
			if (Array.isArray(data)) {
				response.data = data.map(function (obj) {
					return new that(obj);
				});
				//Add "delete" method to results object to quickly delete objects and remove them from the results array
				response.delete = function (object) {
					object.delete().then(function () {
						response.data.splice(response.data.indexOf(object), 1);
					});
				};
			} else {
				response.data = new that(data);
			}
			return deferred.resolve(response);
			//return deferred.resolve(that.successCallback(data, status, headers, config));
		}).error(function (data, status, headers, config) {
			return deferred.reject({result: 'Not ok', data: data});
		});
		return deferred.promise;
	};

	Base.prototype.validate = function () {
		return true;
	};

	Base.prototype.assignProperties = function (data) {

		//~~ Variables
		var _this = this;

		//~~ Functions

		//Look for the property value
		var getPropertyValue = function (_defaultValue, _value) {

			//Check if this property should be an instance of another class
			if (_defaultValue != null && typeof _defaultValue === "function") {

				//Check if it is just an insance or an array of instances
				if (Array.isArray(_value)) {
					return _value.map(function (obj) {
						return new _defaultValue(obj);
					});
				} else {
					return new defaultValue(_value);
				}

				//If it is not an instance just assign everything
			} else {
				return _value;
			}
		};

		//~~ Business Logic
		if (data == null) {
			data = {};
		}

		var properties = this.constructor.properties();

		//Look for each property in the class
		for (var key in data) {

			//Get default value / constructor
			var defaultValue = properties[key];

			_this[key] = getPropertyValue(defaultValue, data[key]);

			if (Array.isArray(data[key])){
				var _key = key;
				
				//Look for each element in the array
				for (var i in data[_key]){

					//Look for each property of the object
					for (var key in data[_key][i]){

						var defaultValue = properties[key];
						
						_this[_key][i][key] = getPropertyValue(defaultValue, data[_key][i][key]);
					}
				}
			}
		};


		/*
    //Look for each property in the class
    for (var key in properties) {
      
      //Get default value / constructor
      var defaultValue = properties[key];
      
      //If it is a value just assign the value
      //but if it is a function then asssign an  instancae
      var getPropertyValue = function () {
        
        //var _i, _len, _ref1, _results;
        if (data[key] !== undefined) {
          
          //if it is a function
          if ((defaultValue != null) && typeof defaultValue === "function") {
            
            if (Array.isArray(data[key])){
              return data[key].map(function (obj) { return new defaultValue(obj); });
            } else {
              return new defaultValue(data[key]);
            }

          } else {
            return data[key];
          }

        } else {
          return defaultValue;
        }   
      };

      _this[key] = getPropertyValue();
    };
    */

		// return the incoming data in case some other function wants to play with it next        
		return data;
	};

	Base.prototype.getDataForApi = function (object) {

		if (object == null) {
			object = this;
		}

		return JSON.parse(JSON.stringify(object));
	};


	/*
    Callbacks for $http response promise
  */

	Base.prototype.successCallback = function (data, status, headers, config) {
		console.log("Actualizar -> Success callback -> Data: ");
		console.log(data);
		return this.assignProperties(data.data);
	};

	Base.prototype.failureCallback = function (data, status, headers, config) {
		console.log(' OOOOO Failure Callback OOOOO');
		console.log(data);
		return this.assignErrors(data);
	};

	Base.prototype.assignErrors = function (errorData) {
		console.log(errorData);
		return this.errors = errorData;
	};
	return Base;
});