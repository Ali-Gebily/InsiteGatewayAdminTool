'use strict';

var FETCH_SIZE = 1000;

/**
 * users controller
 */
controllers
  .controller('usersCtrl', function ($scope, $rootScope, $timeout, ApiService) {
    $rootScope.setCurrentPage('Users');
    $rootScope.requireAuth();

    $scope.hasMore = false;
    $scope.users = [];
    $scope.userIndex = -1;
    $scope.filter = '';
    $scope.errorMessage = {};
    $scope.passwordWarningMessage = null;
    $scope.name = '';
    $scope.enabled = false;
    $scope.email = '';
    $scope.password = '';
    $scope.confirmPassword = '';
    $scope.jobTitle = '';
    $scope.department = '';
    $scope.phoneNumber = '';
    $scope.showSaveConfirm = false;
    var isDirty = false;

    var validPwdChars = '@#$%^&*-_!+=[]{}|\\:\',.?/`~"();';
    var validatePwd = function(pwd) {
      if (pwd.length < 8) {
        return 'Password length is at least 8.';
      }
      if (pwd.length > 16) {
        return 'Password length is at most 16.';
      }
      for (var i = 0; i < pwd.length; i++) {
        var ch = pwd.charAt(i);
        if (!ch.match(/[a-z]/) && !ch.match(/[A-Z]/) && !ch.match(/[0-9]/) && validPwdChars.indexOf(ch) < 0) {
          return 'Password can contain only a-z, A-Z, 0-9, ' + validPwdChars;
        }
      }
      return null;
    };
    var strongPwd = function(pwd) {
      if (validatePwd(pwd)) return false;
      if (pwd.indexOf('.@') >= 0) return false;
      var count = 0;
      if (pwd.match(/[a-z]/)) count++;
      if (pwd.match(/[A-Z]/)) count++;
      if (pwd.match(/[0-9]/)) count++;
      for (var i = 0; i < pwd.length; i++) {
        var ch = pwd.charAt(i);
        if (validPwdChars.indexOf(ch) >= 0) {
          count++;
          break;
        }
      }
      return count >= 3;
    };

    $scope.search = function(loadMore) {
      var query = {
        offset: loadMore ? $scope.users.length : 0,
        size: FETCH_SIZE
      };
      if ($scope.filter && $scope.filter.length > 0) {
        query.name = $scope.filter;
      }
      ApiService.api('/users', 'GET', query, null).then(
        function(data) {
          if (loadMore) {
            $scope.users = $scope.users.concat(data);
          } else {
            $scope.users = data || [];
          }
          $scope.hasMore = (data.length >= FETCH_SIZE);
          $scope.newUser();
        },
        function(data) {
          alert('failed to get users: ' + JSON.stringify(data));
        }
      );
    };
    $scope.search(false);

    $scope.selectUser = function(userIndex) {
      if (isDirty) {
        var res = confirm('The user data are not saved, are you sure you want to discard them ?');
        if (res) {
          isDirty = false;
        } else {
          return;
        }
      }

      $scope.userIndex = userIndex;
      $scope.errorMessage = {};
      $scope.passwordWarningMessage = null;
      var user = $scope.users[userIndex];
      $scope.name = user.displayName;
      $scope.enabled = ((user.accountEnabled || '').toLowerCase() == 'true');
      $scope.email = user.email;
      $scope.password = '';
      $scope.confirmPassword = '';
      $scope.jobTitle = user.jobTitle;
      $scope.department = user.department;
      $scope.phoneNumber = user.phoneNumber;
    };

    $scope.newUser = function() {
      $scope.userIndex = -1;
      $scope.errorMessage = {};
      $scope.passwordWarningMessage = null;
      $scope.name = '';
      $scope.enabled = false;
      $scope.email = '';
      $scope.password = '';
      $scope.confirmPassword = '';
      $scope.jobTitle = '';
      $scope.department = '';
      $scope.phoneNumber = '';
    };

    $scope.confirmSave = function() {
      $scope.showSaveConfirm = false;
    };

    var doSaveUser = function() {
      var userData = {
        email: $scope.email,
        password: $scope.password,
        displayName: $scope.name,
        accountEnabled: $scope.enabled ? 'true' : 'false',
        jobTitle: $scope.jobTitle,
        department: $scope.department,
        phoneNumber: $scope.phoneNumber
      };
      var path;
      var method;
      if ($scope.userIndex >= 0) {
        path = '/user/' + $scope.users[$scope.userIndex].id;
        method = 'PUT';
        userData.updatedBy = $rootScope.user.email;
      } else {
        path = '/user';
        method = 'POST';
        userData.createdBy = $rootScope.user.email;
      }
      ApiService.api(path, method, null, userData).then(
        function(data) {
          if ($scope.userIndex >= 0) {
            // update user data in users list
            $scope.users[$scope.userIndex] = data;
          } else {
            // add user data to the users list
            $scope.users.push(data);
            // select the just added new user
            $scope.userIndex = $scope.users.length - 1;
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
          alert('failed to save user: ' + JSON.stringify(data));
        }
      );
    };

    $scope.saveUser = function() {
      $scope.errorMessage = {};
      if (!$scope.name || $scope.name.length == 0) {
        $scope.errorMessage.name = 'The name is required.';
        return;
      }
      if (!$scope.email || $scope.email.length == 0) {
        $scope.errorMessage.email = 'The email is required.';
        return;
      }
      var emailRE = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!emailRE.test($scope.email)) {
        $scope.errorMessage.email = 'The email is invalid.';
        return;
      }
      if (!$scope.password || $scope.password.length == 0) {
        $scope.errorMessage.password = 'The password is required.';
        return;
      }
      var msg = validatePwd($scope.password);
      if (msg) {
        $scope.errorMessage.password = msg;
        return;
      }
      if ($scope.password != $scope.confirmPassword) {
        $scope.errorMessage.confirmPassword = 'The password and confirm password are different.';
        return;
      }
      if ($scope.phoneNumber && $scope.phoneNumber.length > 0) {
        var validPhone = true;
        for (var i = 0; i < $scope.phoneNumber.length; i++) {
          var ch = $scope.phoneNumber.charAt(i);
          if (!ch.match(/[0-9]/) && '()-'.indexOf(ch) < 0) {
            validPhone = false;
            break;
          }
        }
        if (!validPhone) {
          $scope.errorMessage.phone = 'Invalid phone number.';
          return;
        }
      }
      // check whether the email is used by others,
      // for updating user, if email is not changed, then it is ok
      if ($scope.userIndex < 0 || $scope.users[$scope.userIndex].email != $scope.email) {
        // need to check whether email is used by others
        ApiService.api('/users', 'GET', { email: $scope.email, size: 1 }, null).then(
          function(data) {
            if (data.length > 0) {
              $scope.errorMessage.email = 'The email is already used.';
            } else {
              doSaveUser();
            }
          },
          function(data) {
            alert('failed to get users by email: ' + JSON.stringify(data));
          }
        );
      } else {
        doSaveUser();
      }
    };

    $scope.passwordChanged = function () {
      $scope.passwordWarningMessage = null;
      var pwd = $scope.password || '';
      if (!strongPwd(pwd)) {
        $scope.passwordWarningMessage = 'Password is weak.';
      }
    };
    $scope.userChanged = function () {
      isDirty = true;
    };

    $rootScope.$on('$stateChangeStart', function(event) {
      if (isDirty) {
        var res = confirm('The user data are not saved, are you sure you want to leave the current page ?');
        if (!res) {
          event.preventDefault();
        } else {
          isDirty = false;
        }
      }
    });

    $scope.checkDirtyForNewUser = function() {
      if (isDirty) {
        var res = confirm('The user data are not saved, are you sure you want to discard them and create new user ?');
        if (res) {
          isDirty = false;
        } else {
          return;
        }
      }
      $scope.newUser();
    };

  });
