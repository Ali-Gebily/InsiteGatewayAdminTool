'use strict';

/**
 * login controller
 */
controllers
  .controller('loginCtrl', function ($scope, $rootScope, ADMIN_CREDENTIAL) {
    $rootScope.setCurrentPage('Login');
    $scope.email = "";
    $scope.password = "";
    $scope.errorMessage = null;

    $scope.login = function () {
      $scope.errorMessage = null;
      if($scope.email === ADMIN_CREDENTIAL[0] && $scope.password === ADMIN_CREDENTIAL[1]) {
        var data = { email: $scope.email };
        localStorage.setItem("currentUser", JSON.stringify(data));
        $rootScope.user = data;
        location.href = "#/users";
      } else {
        $scope.errorMessage = 'Invalid credential.';
      }
    };
  });
