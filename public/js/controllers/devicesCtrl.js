'use strict';

/**
 * devices controller
 */
controllers
  .controller('devicesCtrl', function ($scope, $rootScope, ApiService) {
    $rootScope.setCurrentPage('Devices');
    $rootScope.requireAuth();
  });
