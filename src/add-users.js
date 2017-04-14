/**
 * Add users to database. It will first clear all existing users.
 * Usage: node src/add-users
 */
'use strict';

require('./bootstrap');
const co = require('co');
const User = require('./models').User;
const logger = require('./common/logger');
const helper = require('./common/helper');

const USER_COUNT = 2000;

co(function*() {
  // hash a password
  const password = yield helper.hashString('password');
  // clear uesrs
  yield User.remove();
  // add users
  for (let i = 0; i < USER_COUNT; i++) {
    const user = {
      email: `user${i}@test.com`,
      password,
      displayName: `user${i}`,
      jobTitle: 'job title',
      department: 'department',
      phoneNumber: '111-222-333',
      accountEnabled: 'true',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'system',
    };
    yield User.create(user);
  }
}).then(() => {
  logger.info('done');
  process.exit();
}).catch((e) => {
  logger.error(e);
  logger.error(e.stack);
  process.exit();
});
