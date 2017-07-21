'use strict';

/**
 * roles controller
 */
controllers
  .controller('rolesCtrl', function ($scope, $rootScope, $timeout, ApiService) {
    $rootScope.setCurrentPage('Roles');
    $rootScope.requireAuth();

    $scope.operationApps = [];
    $scope.adapters = [];
    var selectedAdapter = null;
    $scope.theAdapterId = '';
    // roles 
    $scope.roles = [];
    $scope.roleIndex = -1;
    $scope.name = '';
    $scope.appId = null;
    $scope.description = '';
    $scope.nameError = null;
    $scope.appIdError = null;
    $scope.descriptionError = null;
    $scope.showSaveConfirm = false;
    $scope.showDeleteConfirm = false;
    $scope.roleOperations = [];
    $scope.operations = [];
    $scope.operationIds = [];
    var isDirty = false;

    // get adapters
    ApiService.api('/adapters', 'GET', null, null).then(
      function (data) {
        $scope.adapters = data;
      },
      function (data) {
        alert('failed to get adapters: ' + JSON.stringify(data));
      }
    );
    // get apps
    ApiService.api('/apps', 'GET', null, null).then(
      function (data) {
        $scope.operationApps = data;
      },
      function (data) {
        alert('failed to get operation apps: ' + JSON.stringify(data));
      }
    );

    $scope.selectAdapter = function () {
      if (isDirty) {
        var res = confirm('The role data are not saved, are you sure you want to discard them ?');
        if (res) {
          isDirty = false;
        } else {
          // change back the adapter
          $timeout(function () {
            $scope.theAdapterId = selectedAdapter.id;
          }, 200);
          return;
        }
      }
      var adapterIndex = -1;
      for (var loop = 0; loop < $scope.adapters.length; loop++) {
        if ($scope.adapters[loop].id == $scope.theAdapterId) {
          adapterIndex = loop;
          break;
        }
      }
      if (adapterIndex < 0) return;

      selectedAdapter = $scope.adapters[adapterIndex];
      $scope.roleOperations = [];
      // get roles of the selected adapter
      ApiService.api('/roles/adapter/' + selectedAdapter.id, 'GET', null, null).then(
        function (data) {
          $scope.roles = data;
          $scope.newRole();
        },
        function (data) {
          alert('failed to get roles of adapter: ' + JSON.stringify(data));
        }
      );
      // get operations of the selected adapter
      ApiService.api('/operations/adapter/' + selectedAdapter.id, 'GET', null, null).then(
        function (data) {
          $scope.operations = data;
          $scope.newRole();
        },
        function (data) {
          alert('failed to get operations of adapter: ' + JSON.stringify(data));
        }
      );
    };

    $scope.selectRole = function (roleIndex) {
      if (isDirty) {
        var res = confirm('The role data are not saved, are you sure you want to discard them ?');
        if (res) {
          isDirty = false;
        } else {
          return;
        }
      }

      $scope.roleIndex = roleIndex;
      $scope.name = $scope.roles[roleIndex].name;
      $scope.appId = $scope.roles[roleIndex].appId;
      $scope.description = $scope.roles[roleIndex].description;
      $scope.roleOperations = angular.copy($scope.operations);

      $scope.operationIds = $scope.roles[roleIndex].operationIds;
      angular.forEach($scope.roleOperations, function (item) {
        item.checked = $scope.operationIds.indexOf(item.id) >= 0;
      });

      $scope.nameError = null;
      $scope.appIdError = null;
      $scope.descriptionError = null;

    };

    $scope.newRole = function () {
      $scope.roleIndex = -1;
      $scope.name = '';
      $scope.appId = null;
      $scope.description = ' ';
      $scope.operationIds = [];
      $scope.roleOperations = angular.copy($scope.operations);
      $scope.nameError = null;
      $scope.appIdError = null;
      $scope.descriptionError = null;
    };

    $rootScope.$on('$stateChangeStart', function (event) {
      if (isDirty) {
        var res = confirm('The role data are not saved, are you sure you want to leave the current page ?');
        if (!res) {
          event.preventDefault();
        } else {
          isDirty = false;
        }
      }
    });

    $scope.checkDirtyForNewRole = function () {
      if (isDirty) {
        var res = confirm('The role data are not saved, are you sure you want to discard them and create new operation ?');
        if (res) {
          isDirty = false;
        } else {
          return;
        }
      }
      $scope.newRole();
    };

    $scope.saveRole = function () {
      $scope.nameError = null;
      $scope.appIdError = null;
      $scope.descriptionError = null;
      $scope.isError = false;
      if (!$scope.name || $scope.name.length == 0) {
        $scope.nameError = 'The name is required.';
        $scope.isError = true;
      }
      if (!$scope.description || $scope.description.trim().length == 0) {
        $scope.descriptionError = 'The description is required.';
        $scope.isError = true;
      }
      if (!$scope.appId || $scope.appId.length == 0) {
        $scope.appIdError = 'The app id is required.';
        $scope.isError = true;
      }
      if ($scope.isError) {
        return;
      }

      var path;
      var method;
      var roleData = {
        name: $scope.name,
        description: $scope.description,
        appId: $scope.appId,
        adapterId: selectedAdapter.id,
        operationIds: []
      };
      angular.forEach($scope.roleOperations, function (item) {
        if (item.checked) {
          roleData.operationIds.push(item.id);
        }
      });
      if ($scope.roleIndex >= 0) {
        roleData.updatedBy = $rootScope.user.email;
        path = '/roles/' + $scope.roles[$scope.roleIndex].id;
        method = 'PUT';
      } else {
        roleData.createdBy = $rootScope.user.email;
        path = '/roles';
        method = 'POST';
      }
      ApiService.api(path, method, null, roleData).then(
        function (data) {
          if ($scope.roleIndex >= 0) {
            // update role data in roles list
            $scope.roles[$scope.roleIndex] = data;
          } else {
            // add role data to the roles list
            $scope.roles.push(data);
            // select the just added new role
            $scope.roleIndex = $scope.roles.length - 1;
          }
          // clear dirty flag
          isDirty = false;
          // show confirmation
          $scope.showSaveConfirm = true;
          // close it in 3 seconds
          $timeout(function () {
            $scope.showSaveConfirm = false;
          }, 3000);
        },
        function (data) {
          alert('failed to save role: ' + JSON.stringify(data));
        }
      );
    };

    $scope.roleChanged = function () {
      if (!selectedAdapter) {
        alert('Please select a adapter.');
        return;
      }
      isDirty = true;
    };

    $scope.deleteRole = function () {
      if ($scope.roleIndex >= 0) {
        var res = confirm('Are you sure you wish to delete this Role?');
        if (!res) {
          event.preventDefault();
        } else {
          ApiService.api('/roles/' + $scope.roles[$scope.roleIndex].id, 'DELETE', null, null).then(
            function (data) {
              // remove item from current list
              $scope.roles.splice($scope.roleIndex, 1);
              // show confirmation
              $scope.showDeleteConfirm = true;
              // close it in 3 seconds
              $timeout(function () {
                $scope.showDeleteConfirm = false;
              }, 3000);

              // set form to empty
              $scope.newRole();
            },
            function (data) {
              alert('failed to delete role: ' + JSON.stringify(data));
            }
          );
        }
      } else {
        alert('Please select existing role to delete.');
      }
    };
  });
