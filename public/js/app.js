'use strict';

/**
 * Module App
 */

window.addEventListener('WebComponentsReady', function (e) {
  // imports are loaded and elements have been registered
  angular.element(document).ready(function () {

    var app = angular.module('app', ['ng-polymer-elements', 'ui.router', 'controllers', 'growlNotifications']);

    // route provider
    app.config(function ($stateProvider, $urlRouterProvider) {
      // For any unmatched url, redirect to /users
      $urlRouterProvider.otherwise("/users");

      $stateProvider
        .state("login", {
          url: "/login",
          templateUrl: "partials/login.html",
          controller: 'loginCtrl'
        });
      $stateProvider
        .state("users", {
          url: "/users",
          templateUrl: "partials/users.html",
          controller: 'usersCtrl'
        });
      $stateProvider
        .state("home", {
          url: "/home",
          templateUrl: "partials/home.html",
          controller: 'homeCtrl'
        });
      $stateProvider
        .state("sites", {
          url: "/sites",
          templateUrl: "partials/sites.html",
          controller: 'sitesCtrl'
        });
      $stateProvider
        .state("apps", {
          url: "/apps",
          templateUrl: "partials/apps.html",
          controller: 'appsCtrl'
        });
      $stateProvider
        .state("devices", {
          url: "/devices",
          templateUrl: "partials/devices.html",
          controller: 'devicesCtrl'
        });
      $stateProvider
        .state("deviceProfiles", {
          url: "/deviceProfiles",
          templateUrl: "partials/deviceProfiles.html",
          controller: 'deviceProfilesCtrl'
        });
      $stateProvider
        .state("operations", {
          url: "/operations",
          templateUrl: "partials/operations.html",
          controller: "operationsCtrl"
        });
      $stateProvider
        .state("resources", {
          url: "/resources",
          templateUrl: "partials/resources.html",
          controller: "resourcesCtrl"
        });
      $stateProvider
        .state("roles", {
          url: "/roles",
          templateUrl: "partials/roles.html",
          controller: "rolesCtrl"
        });
    });

    // disable cache for IE
    app.config(function ($httpProvider) {
      // Initialize get if not there
      if (!$httpProvider.defaults.headers.get) {
        $httpProvider.defaults.headers.get = {};
      }
      // Enables Request.IsAjaxRequest()
      $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
      // disable cache for IE ajax
      $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
      $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
    });

    angular.bootstrap(document, ['app']);

  });
});
