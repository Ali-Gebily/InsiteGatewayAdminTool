'use strict';

/**
 * sites controller
 */
controllers
  .controller('sitesCtrl', function ($scope, $rootScope, ApiService) {
    $rootScope.setCurrentPage('Sites');
    $rootScope.requireAuth();
  });
