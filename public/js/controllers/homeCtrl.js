'use strict';

/**
 * home controller
 */
controllers
  .controller('homeCtrl', function ($scope, $rootScope, ApiService) {
    $rootScope.setCurrentPage('Home');
    $rootScope.requireAuth();
  });
