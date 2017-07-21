'use strict';

/**
 * operations controller
 */
controllers
  .controller('operationsCtrl', function ($scope, $rootScope, $timeout, ApiService) {
    $rootScope.setCurrentPage('Operations');
    $rootScope.requireAuth();

    $scope.operationApps = [];
    $scope.adapters = [];
    var selectedAdapter = null;
    $scope.theAdapterId = '';
    // operations 
    $scope.operations = [];
    $scope.operationIndex = -1;
    $scope.name = '';
    $scope.appId = null;
    $scope.description = '';
    $scope.nameError = null;
    $scope.appIdError = null;
    $scope.descriptionError = null;
    $scope.showSaveConfirm = false;
    $scope.showDeleteConfirm = false;
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
        var res = confirm('The operation data are not saved, are you sure you want to discard them ?');
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
      // get operations of the selected adapter
      ApiService.api('/operations/adapter/' + selectedAdapter.id, 'GET', null, null).then(
        function (data) {
          $scope.operations = data;
          $scope.newOperation();
        },
        function (data) {
          alert('failed to get operations of adapter: ' + JSON.stringify(data));
        }
      );
    };

    $scope.selectOperation = function (operationIndex) {
      if (isDirty) {
        var res = confirm('The operation data are not saved, are you sure you want to discard them ?');
        if (res) {
          isDirty = false;
        } else {
          return;
        }
      }

      $scope.operationIndex = operationIndex;
      $scope.name = $scope.operations[operationIndex].name;
      $scope.appId = $scope.operations[operationIndex].appId;
      $scope.description = $scope.operations[operationIndex].description;
      $scope.nameError = null;
      $scope.appIdError = null;
      $scope.descriptionError = null;
    };

    $scope.newOperation = function () {
      $scope.operationIndex = -1;
      $scope.name = '';
      $scope.appId = null;
      $scope.description = ' ';
      $scope.nameError = null;
      $scope.appIdError = null;
      $scope.descriptionError = null;
    };

    $rootScope.$on('$stateChangeStart', function (event) {
      if (isDirty) {
        var res = confirm('The operation data are not saved, are you sure you want to leave the current page ?');
        if (!res) {
          event.preventDefault();
        } else {
          isDirty = false;
        }
      }
    });

    $scope.checkDirtyForNewOperation = function () {
      if (isDirty) {
        var res = confirm('The operation data are not saved, are you sure you want to discard them and create new operation ?');
        if (res) {
          isDirty = false;
        } else {
          return;
        }
      }
      $scope.newOperation();
    };

    $scope.saveOperation = function () {
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
      var operationData = {
        name: $scope.name,
        description: $scope.description,
        appId: $scope.appId,
        adapterId: selectedAdapter.id
      };
      if ($scope.operationIndex >= 0) {
        operationData.updatedBy = $rootScope.user.email;
        path = '/operations/' + $scope.operations[$scope.operationIndex].id;
        method = 'PUT';
      } else {
        operationData.createdBy = $rootScope.user.email;
        path = '/operations';
        method = 'POST';
      }
      ApiService.api(path, method, null, operationData).then(
        function (data) {
          if ($scope.operationIndex >= 0) {
            // update operation data in operations list
            $scope.operations[$scope.operationIndex] = data;
          } else {
            // add operation data to the operations list
            $scope.operations.push(data);
            // select the just added new operation
            $scope.operationIndex = $scope.operations.length - 1;
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
          alert('failed to save operation: ' + JSON.stringify(data));
        }
      );
    };

    $scope.operationChanged = function () {
      if (!selectedAdapter) {
        alert('Please select a adapter.');
        return;
      }
      isDirty = true;
    };

    $scope.deleteOperation = function () {
      if ($scope.operationIndex >= 0) {
        var res = confirm('Are you sure you wish to delete this Operation?');
        if (!res) {
          event.preventDefault();
        } else {
          ApiService.api('/operations/' + $scope.operations[$scope.operationIndex].id, 'DELETE', null, null).then(
            function (data) {
              // remove item from current list
              $scope.operations.splice($scope.operationIndex, 1);
              // show confirmation
              $scope.showDeleteConfirm = true;
              // close it in 3 seconds
              $timeout(function () {
                $scope.showDeleteConfirm = false;
              }, 3000);

              // set form to empty
              $scope.newOperation();
            },
            function (data) {
              alert('failed to delete operation: ' + JSON.stringify(data));
            }
          );
        }
      } else {
        alert('Please select existing operation to delete.');
      }
    };
  });
