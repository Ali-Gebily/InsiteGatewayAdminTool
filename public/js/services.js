'use strict';

/**
 * module services
 */
angular.module('services', ['config'])

  // API service
  .factory('ApiService', ['$http', '$q', 'BASE_URL', function ($http, $q, BASE_URL) {
    return {
      api: function(path, method, query, body) {
        var deferred = $q.defer();
        var options = {
          method: method,
          url: BASE_URL + path
        };
        if (query) {
          options.params = query;
        }
        if (body) {
          options.data = body;
        }
        $http(options).
        success(function(data, status, headers, config) {
          deferred.resolve(data);
        }).
        error(function(data, status, headers, config) {
          deferred.reject({ data: data, status: status });
        });
        return deferred.promise;
      }
    };
  }]);
