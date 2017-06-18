'use strict';

/**
 * device profiles controller
 */
controllers
  .controller('deviceProfilesCtrl', function ($scope, $rootScope, $timeout, ApiService) {
    $rootScope.setCurrentPage('Device Profiles');
    $rootScope.requireAuth();

    $scope.profiles = [];
    $scope.profileIndex = -1;
    $scope.profileKeyword = '';
    $scope.channelKeyword = '';
    $scope.errorMessage = {};
    $scope.name = '';
    $scope.version = '';
    $scope.vendor = '';
    $scope.model = '';
    $scope.leftChannels = [];
    $scope.rightChannels = [];

    $scope.showConfirm = false;
    $scope.confirmMessage = '';
    var isDirty = false;
    var allChannels = null;

    $scope.searchProfiles = function() {
      if (!allChannels) return;
      if (isDirty) {
        var res = confirm('The profile data are not saved, are you sure you want to discard them ?');
        if (res) {
          isDirty = false;
        } else {
          return;
        }
      }

      var query = {};
      if ($scope.profileKeyword && $scope.profileKeyword.length > 0) {
        query.keyword = $scope.profileKeyword;
      }
      ApiService.api('/deviceprofiles', 'GET', query, null).then(
        function(data) {
          $scope.profiles = data;
          $scope.newProfile();
        },
        function(data) {
          alert('failed to search device profiles: ' + JSON.stringify(data));
        }
      );
    };

    // get channels
    ApiService.api('/mclchannels', 'GET', null, null).then(
      function(data) {
        allChannels = data || [];
        // do an initial profile search
        $scope.searchProfiles();
      },
      function(data) {
        alert('failed to get channels: ' + JSON.stringify(data));
      }
    );

    $scope.selectProfile = function(profileIndex) {
      if (isDirty) {
        var res = confirm('The profile data are not saved, are you sure you want to discard them ?');
        if (res) {
          isDirty = false;
        } else {
          return;
        }
      }

      $scope.profileIndex = profileIndex;
      $scope.errorMessage = {};
      var profile = $scope.profiles[profileIndex];
      $scope.channelKeyword = '';
      $scope.name = profile.name;
      $scope.version = profile.version;
      $scope.vendor = profile.vendor;
      $scope.model = profile.model;
      var left = [];
      var right = [];
      if (!profile.channelIds) profile.channelIds = [];
      for (var i = 0; i < allChannels.length; i++) {
        var rightChannel = angular.copy(allChannels[i]);
        if (profile.channelIds.indexOf(allChannels[i].id) >= 0) {
          left.push(angular.copy(allChannels[i]));
          rightChannel.checked = true;
        } else {
          rightChannel.checked = false;
        }
        right.push(rightChannel);
      }
      $scope.leftChannels = left;
      $scope.rightChannels = right;
    };

    $scope.newProfile = function() {
      if (!allChannels) return;

      $scope.profileIndex = -1;
      $scope.errorMessage = {};
      $scope.channelKeyword = '';
      $scope.errorMessage = {};
      $scope.name = '';
      $scope.version = '';
      $scope.vendor = '';
      $scope.model = '';
      $scope.leftChannels = [];
      $scope.rightChannels = angular.copy(allChannels);
    };

    $scope.profileChanged = function () {
      isDirty = true;
    };

    function matchChannel(channel, keyword) {
      if (!keyword || keyword.length == 0) return true;
      var re = new RegExp(keyword, 'i');
      return channel.mclname && re.test(channel.mclname) ||
        channel.lname && re.test(channel.lname) ||
        channel.sname && re.test(channel.sname) ||
        channel.unit && re.test(channel.unit) ||
        channel.lunit && re.test(channel.lunit) ||
        channel.sunit && re.test(channel.sunit) ||
        channel.category && re.test(channel.category) ||
        channel.lcategory && re.test(channel.lcategory) ||
        channel.scategory && re.test(channel.scategory);
    }

    $scope.searchChannels = function () {
      var leftIds = [];
      for (var i = 0; i < $scope.leftChannels.length; i++) {
        leftIds.push($scope.leftChannels[i].id);
      }
      var right = [];
      for (var i = 0; i < allChannels.length; i++) {
        if (matchChannel(allChannels[i], $scope.channelKeyword)) {
          var channel = angular.copy(allChannels[i]);
          if (leftIds.indexOf(allChannels[i].id) < 0) {
            channel.checked = false;
          } else {
            channel.checked = true;
          }
          right.push(channel);
        }
      }
      $scope.rightChannels = right;
    };

    // "Add Selected" operation synchronizes channels, it may add or remove channels to/from profile
    $scope.addSelected = function () {
      var updated = false;
      var left = [];
      // find kept left channels
      for (var i = 0; i < $scope.leftChannels.length; i++) {
        var leftChannel = $scope.leftChannels[i];
        var found = false;
        var checked = false;
        for (var j = 0; j < $scope.rightChannels.length; j++) {
          var rightChannel = $scope.rightChannels[j];
          if (leftChannel.id == rightChannel.id) {
            found = true;
            checked = rightChannel.checked;
            break;
          }
        }
        if (!found || checked) {
          left.push(leftChannel);
        }
      }
      if (left.length != $scope.leftChannels.length) {
        updated = true;
        isDirty = true;
      }
      // add new channels
      for (var j = 0; j < $scope.rightChannels.length; j++) {
        var rightChannel = $scope.rightChannels[j];
        if (rightChannel.checked) {
          var found = false;
          for (var i = 0; i < $scope.leftChannels.length; i++) {
            var leftChannel = $scope.leftChannels[i];
            if (leftChannel.id == rightChannel.id) {
              found = true;
              break;
            }
          }
          if (!found) {
            updated = true;
            isDirty = true;
            var newChannel = angular.copy(rightChannel);
            newChannel.checked = false;
            left.push(newChannel);
          }
        }
      }
      $scope.leftChannels = left;
      if (updated) showConfirmation('Channel(s) added successfully.');
    };

    $scope.removeSelected = function () {
      var removed = false;
      var left = [];
      for (var i = 0; i < $scope.leftChannels.length; i++) {
        var channel = $scope.leftChannels[i];
        if (channel.checked) {
          removed = true;
          isDirty = true;
          // uncheck the channel in the right side list, if it is there
          for (var j = 0; j < $scope.rightChannels.length; j++) {
            var rightChannel = $scope.rightChannels[j];
            if (rightChannel.id == channel.id) {
              rightChannel.checked = false;
              break;
            }
          }
        } else {
          channel.checked = false;
          left.push(channel);
        }
      }
      $scope.leftChannels = left;
      if (removed) showConfirmation('Channel(s) removed successfully.');
    };

    $scope.checkDirtyForNewProfile = function() {
      if (isDirty) {
        var res = confirm('The profile data are not saved, are you sure you want to discard them and create new profile ?');
        if (res) {
          isDirty = false;
        } else {
          return;
        }
      }
      $scope.newProfile();
    };

    function showConfirmation(message) {
      $scope.confirmMessage = message;
      $scope.showConfirm = true;
      // close it in 3 seconds
      $timeout(function() {
        $scope.showConfirm = false;
      }, 3000);
    }

    $scope.saveProfile = function() {
      $scope.errorMessage = {};
      if (!$scope.name || $scope.name.length == 0) {
        $scope.errorMessage.name = 'The name is required.';
        return;
      }
      if (!$scope.version || $scope.version.length == 0) {
        $scope.errorMessage.version = 'The version is required.';
        return;
      }
      if (!$scope.vendor || $scope.vendor.length == 0) {
        $scope.errorMessage.vendor = 'The vendor is required.';
        return;
      }
      if (!$scope.model || $scope.model.length == 0) {
        $scope.errorMessage.model = 'The model is required.';
        return;
      }

      var path;
      var method;
      var profileData = {
        name: $scope.name,
        version: $scope.version,
        vendor: $scope.vendor,
        model: $scope.model,
        channelIds: []
      };
      for (var i = 0; i < $scope.leftChannels.length; i++) {
        profileData.channelIds.push($scope.leftChannels[i].id);
      }
      if ($scope.profileIndex >= 0) {
        profileData.updatedBy = $rootScope.user.email;
        path = '/deviceprofile/' + $scope.profiles[$scope.profileIndex].id;
        method = 'PUT';
      } else {
        profileData.createdBy = $rootScope.user.email;
        path = '/deviceprofile';
        method = 'POST';
      }
      ApiService.api(path, method, null, profileData).then(
        function(data) {
          if ($scope.profileIndex >= 0) {
            // update profile data in profiles list
            $scope.profiles[$scope.profileIndex] = data;
          } else {
            // add data to the profiles list
            $scope.profiles.push(data);
            // select the just added new profile
            $scope.profileIndex = $scope.profiles.length - 1;
          }
          // clear dirty flag
          isDirty = false;
          // show confirmation
          showConfirmation('Profile saved successfully.');
        },
        function(data) {
          alert('failed to save profile: ' + JSON.stringify(data));
        }
      );
    };

    $scope.downloadProfile = function() {
      if (isDirty) {
        alert('The profile data should be saved before download.');
        return;
      }
      if ($scope.profileIndex < 0) {
        alert('No profile is selected or profile is not saved.');
        return;
      }
      ApiService.downloadDeviceProfile($scope.profiles[$scope.profileIndex].id);
    };

    $rootScope.$on('$stateChangeStart', function(event) {
      if (isDirty) {
        var res = confirm('The profile data are not saved, are you sure you want to leave the current page ?');
        if (!res) {
          event.preventDefault();
        } else {
          isDirty = false;
        }
      }
    });

  });
