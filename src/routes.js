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
};
