'use strict';

/**
 * main controller
 */
var controllers = angular.module('controllers', ['services', 'config'])
  .controller('mainCtrl', function ($scope, $rootScope, HEADER_TABS, $window) {
    if (localStorage.getItem('currentUser')) {
      $rootScope.user = JSON.parse(localStorage.getItem('currentUser'));
    }

    $rootScope.HEADER_TABS = HEADER_TABS;
    $rootScope.LEFT_TABS = [];
    $rootScope.CURRENT_TAB = null;
    $rootScope.RIGHT_TABS = [];
    $rootScope.WIN_WIDTH = $window.innerWidth;

    $rootScope.requireAuth = function() {
      if (!$rootScope.user) {
        location.href = "#/login";
      }
    };
    $rootScope.setCurrentPage = function(page) {
      $rootScope.page = page;
      var current = null;
      var left = [];
      var right = [];
      var i;
      for (i = 0; i < HEADER_TABS.length; i++) {
        if (page == HEADER_TABS[i][0]) {
          current = [HEADER_TABS[i][0], HEADER_TABS[i][1], i];
          break;
        }
        left.push([HEADER_TABS[i][0], HEADER_TABS[i][1], i]);
      }
      i++;
      for (; i < HEADER_TABS.length; i++) {
        right.push([HEADER_TABS[i][0], HEADER_TABS[i][1], i]);
      }
      $rootScope.LEFT_TABS = left;
      $rootScope.RIGHT_TABS = right;
      $rootScope.CURRENT_TAB = current;
    };
    $rootScope.selectTab = function(pageIndex) {
      location.href = HEADER_TABS[pageIndex][2];
    };

    $rootScope.$watch(function() {
      return $window.innerWidth;
    }, function(value) {
      $rootScope.WIN_WIDTH = value;
    });
  });
