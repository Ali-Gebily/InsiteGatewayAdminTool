'use strict';

/**
 * resources controller
 */
controllers
  .controller('resourcesCtrl', function ($scope, $rootScope, ApiService) {
    $rootScope.setCurrentPage('Resources');
    $rootScope.requireAuth();
  });
