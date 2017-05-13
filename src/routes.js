'use strict';

module.exports = {
  '/users': {
    get: {
      controller: 'UserController',
      method: 'search',
    },
  },
  '/user': {
    post: {
      controller: 'UserController',
      method: 'create',
    },
  },
  '/user/:id': {
    get: {
      controller: 'UserController',
      method: 'get',
    },
    put: {
      controller: 'UserController',
      method: 'update',
    },
  },

  '/sites': {
    get: {
      controller: 'SiteController',
      method: 'getAll',
    },
  },

  '/devices/site/:siteId': {
    get: {
      controller: 'DeviceController',
      method: 'getDevicesBySiteId',
    },
  },
  '/device/:id': {
    get: {
      controller: 'DeviceController',
      method: 'get',
    },
    put: {
      controller: 'DeviceController',
      method: 'update',
    },
  },
  '/device': {
    post: {
      controller: 'DeviceController',
      method: 'create',
    },
  },
  '/deviceingresspaths': {
    get: {
      controller: 'DeviceController',
      method: 'getAllDeviceIngressPaths',
    },
  },
};
