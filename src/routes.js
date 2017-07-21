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

  '/mclchannels': {
    get: {
      controller: 'DeviceProfileController',
      method: 'getAllChannels',
    },
  },
  '/deviceprofiles': {
    get: {
      controller: 'DeviceProfileController',
      method: 'searchDeviceProfiles',
    },
  },
  '/deviceprofile/:id': {
    get: {
      controller: 'DeviceProfileController',
      method: 'get',
    },
    put: {
      controller: 'DeviceProfileController',
      method: 'update',
    },
  },
  '/deviceprofile': {
    post: {
      controller: 'DeviceProfileController',
      method: 'create',
    },
  },
  '/deviceprofile/:id/download': {
    get: {
      controller: 'DeviceProfileController',
      method: 'download',
    },
  },
  '/apps': {
    get: {
      controller: 'AppController',
      method: 'getAll',
    },
  },
  '/adapters': {
    get: {
      controller: 'AdapterController',
      method: 'getAll',
    },
  },
  '/operations/adapter/:adapterId': {
    get: {
      controller: 'OperationController',
      method: 'getOperationsByAdapterId',
    },
  },
  '/operations/:id': {
    get: {
      controller: 'OperationController',
      method: 'get',
    },
    put: {
      controller: 'OperationController',
      method: 'update',
    },
    delete: {
      controller: 'OperationController',
      method: 'remove',
    },
  },
  '/operations': {
    post: {
      controller: 'OperationController',
      method: 'create',
    },
  },
  '/roles/adapter/:adapterId': {
    get: {
      controller: 'RoleController',
      method: 'getRolesByAdapterId',
    },
  },
  '/roles/:id': {
    get: {
      controller: 'RoleController',
      method: 'get',
    },
    put: {
      controller: 'RoleController',
      method: 'update',
    },
    delete: {
      controller: 'RoleController',
      method: 'remove',
    },
  },
  '/roles': {
    post: {
      controller: 'RoleController',
      method: 'create',
    },
  },
};
