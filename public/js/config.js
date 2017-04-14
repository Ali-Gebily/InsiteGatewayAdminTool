'use strict';

var config = angular.module('config', []);

config.constant('BASE_URL', './api/v1');

config.constant('HEADER_TABS', [
  // [tab long name shown in desktop, tab short name shown in mobile, tab link]
  ['Home', 'Home', '#/home'],
  ['Sites', 'Site', '#/sites'],
  ['Users', 'User', '#/users'],
  ['Apps', 'App', '#/apps'],
  ['Devices', 'Device', '#/devices'],
  ['Device Profiles', 'Profile', '#/deviceProfiles']
]);

config.constant('ADMIN_CREDENTIAL', ['admin@test.com', 'abc123']);
