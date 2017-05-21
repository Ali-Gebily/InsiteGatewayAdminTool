'use strict';

/**
 * devices controller
 */
controllers
  .controller('devicesCtrl', function ($scope, $rootScope, $timeout, ApiService) {
    $rootScope.setCurrentPage('Devices');
    $rootScope.requireAuth();

    $scope.ingressPaths = [];
    $scope.sites = [];
    var selectedSite = null;
    $scope.theSiteId = '';
    // devices wrappers
    $scope.devices = [];
    $scope.deviceIndex = -1;
    $scope.name = '';
    $scope.ingressPath = null;
    $scope.nameError = null;
    $scope.ingressPathError = null;
    $scope.showSaveConfirm = false;
    var isDirty = false;

    // get sites
    ApiService.api('/sites', 'GET', null, null).then(
      function(data) {
        $scope.sites = data;
      },
      function(data) {
        alert('failed to get sites: ' + JSON.stringify(data));
      }
    );
    // get ingress paths
    ApiService.api('/deviceingresspaths', 'GET', null, null).then(
      function(data) {
        $scope.ingressPaths = data;
      },
      function(data) {
        alert('failed to get device ingress paths: ' + JSON.stringify(data));
      }
    );

    /**
     * Handles the devices fetched from back end.
     * For each device, we will wrap it with an wrapper object, the wrapper contains these fields:
     * - data: the device data from back end
     * - depth: the parent-child relationship depth, it is used to render indent
     * - ids: ids of ancestors and the device itself, in format like ancestor1.id|ancestor2.id|ancestor3.id|...|current-device.id
     *
     * After calculating the wrappers, we will sort the wrappers by ids field, this sorting will automatically do the grouping,
     * devices of the same group will be sorted to be together.
     * Then we render the devices indent according to depth, the final UI is a tree view reflecting the hierarchy.
     *
     * @param {Array} devices the back end devices
     * @returns {Array} the wrapper objects
     */
    var handleDevices = function(devices) {
      var result = [];
      // mapping from device id to wrapper object
      var mapping = {};
      for (var i = 0; i < devices.length; i++) {
        var wrapper = {
          data: devices[i],
          depth: -1,
          ids: ''
        };
        // check root devices
        if (!devices[i].parentId) {
          wrapper.depth = 0;
          wrapper.ids = devices[i].id;
        }
        result.push(wrapper);
        mapping[devices[i].id] = wrapper;
      }
      // calculate depth and ids for all wrappers, root devices are done in above processing
      var doit = true;
      while (doit) {
        doit = false;
        for (var j = 0; j < result.length; j++) {
          if (result[j].depth < 0) {
            // this wrapper is not done yet, check whether its parent is done
            var parentWrapper = mapping[result[j].data.parentId];
            if (parentWrapper.depth >= 0) {
              // parent wrapper is done, then we can handle this wrapper
              result[j].depth = parentWrapper.depth + 1;
              result[j].ids = parentWrapper.ids + '|' + result[j].data.id;
              doit = true;
            }
          }
        }
      }
      // sort the wrappers by ids
      result.sort(function(w1, w2) {
        return w1.ids.localeCompare(w2.ids);
      });
      return result;
    };

    $scope.selectSite = function() {
      if (isDirty) {
        var res = confirm('The device data are not saved, are you sure you want to discard them ?');
        if (res) {
          isDirty = false;
        } else {
          // change back the site
          $timeout(function() {
            $scope.theSiteId = selectedSite.id;
          }, 200);
          return;
        }
      }
      var siteIndex = -1;
      for (var loop = 0; loop < $scope.sites.length; loop++) {
        if ($scope.sites[loop].id == $scope.theSiteId) {
          siteIndex = loop;
          break;
        }
      }
      if (siteIndex < 0) return;

      selectedSite = $scope.sites[siteIndex];
      // get devices of the selected site
      ApiService.api('/devices/site/' + selectedSite.id, 'GET', null, null).then(
        function(data) {
          $scope.devices = handleDevices(data);
          $scope.newDevice();
        },
        function(data) {
          alert('failed to get devices of site: ' + JSON.stringify(data));
        }
      );
    };

    $scope.getIndent = function(depth) {
      var res = [];
      for (var i = 0; i < depth * 8; i++) {
        res.push(i);
      }
      return res;
    };

    $scope.selectDevice = function(deviceIndex) {
      if (isDirty) {
        var res = confirm('The device data are not saved, are you sure you want to discard them ?');
        if (res) {
          isDirty = false;
        } else {
          return;
        }
      }

      $scope.deviceIndex = deviceIndex;
      $scope.name = $scope.devices[deviceIndex].data.name;
      $scope.ingressPath = $scope.devices[deviceIndex].data.ingressPathId;
      $scope.nameError = null;
      $scope.ingressPathError = null;
    };

    $scope.newDevice = function() {
      $scope.deviceIndex = -1;
      $scope.name = '';
      $scope.ingressPath = null;
      $scope.nameError = null;
      $scope.ingressPathError = null;
    };

    $rootScope.$on('$stateChangeStart', function(event) {
      if (isDirty) {
        var res = confirm('The device data are not saved, are you sure you want to leave the current page ?');
        if (!res) {
          event.preventDefault();
        } else {
          isDirty = false;
        }
      }
    });

    $scope.checkDirtyForNewDevice = function() {
      if (isDirty) {
        var res = confirm('The device data are not saved, are you sure you want to discard them and create new device ?');
        if (res) {
          isDirty = false;
        } else {
          return;
        }
      }
      $scope.newDevice();
    };

    $scope.saveDevice = function() {
      $scope.nameError = null;
      $scope.ingressPathError = null;
      if (!$scope.name || $scope.name.length == 0) {
        $scope.nameError = 'The name is required.';
        return;
      }
      if (!$scope.ingressPath || $scope.ingressPath.length == 0) {
        $scope.ingressPathError = 'The ingress path is required.';
        return;
      }

      var path;
      var method;
      var deviceData = {
        name: $scope.name,
        ingressPathId: $scope.ingressPath,
        siteId: selectedSite.id
      };
      if ($scope.deviceIndex >= 0) {
        deviceData.updatedBy = $rootScope.user.email;
        path = '/device/' + $scope.devices[$scope.deviceIndex].data.id;
        method = 'PUT';
      } else {
        deviceData.createdBy = $rootScope.user.email;
        path = '/device';
        method = 'POST';
      }
      ApiService.api(path, method, null, deviceData).then(
        function(data) {
          if ($scope.deviceIndex >= 0) {
            // update device data in devices list
            $scope.devices[$scope.deviceIndex].data = data;
          } else {
            // add device wrapper data to the devices list
            $scope.devices.push({data: data, depth: 0, ids: data.id});
            // select the just added new device
            $scope.deviceIndex = $scope.devices.length - 1;
          }
          // clear dirty flag
          isDirty = false;
          // show confirmation
          $scope.showSaveConfirm = true;
          // close it in 3 seconds
          $timeout(function() {
            $scope.showSaveConfirm = false;
          }, 3000);
        },
        function(data) {
          alert('failed to save device: ' + JSON.stringify(data));
        }
      );
    };

    $scope.deviceChanged = function () {
      if (!selectedSite) {
        alert('Please select a site.');
        return;
      }
      isDirty = true;
    };

  });
