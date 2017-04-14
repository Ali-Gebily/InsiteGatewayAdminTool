'use strict';

/**
 * apps controller
 */
controllers
  .controller('appsCtrl', function ($scope, $rootScope, ApiService) {
    $rootScope.setCurrentPage('Apps');
    $rootScope.requireAuth();
  });
