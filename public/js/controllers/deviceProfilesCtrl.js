'use strict';

/**
 * device profiles controller
 */
controllers
  .controller('deviceProfilesCtrl', function ($scope, $rootScope, ApiService) {
    $rootScope.setCurrentPage('Device Profiles');
    $rootScope.requireAuth();
  });
