/**
 * Initialize data in database.
 * Usage: node src/init-data
 */
'use strict';

require('./bootstrap');
const co = require('co');
const User = require('./models').User;
const Site = require('./models').Site;
const Device = require('./models').Device;
const DeviceIngressPath = require('./models').DeviceIngressPath;
const MCLChannel = require('./models').MCLChannel;
const DeviceProfile = require('./models').DeviceProfile;
const logger = require('./common/logger');
const helper = require('./common/helper');
const Adapter = require('./models').Adapter;
const Operation = require('./models').Operation;
const OperationApp = require('./models').App;
const Role = require('./models').Role;
const Tag = require('./models').Tag;

const USER_COUNT = 2000;

co(function* () {
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

  // init sites
  yield Site.remove();
  const site1 = yield Site.create({ name: 'Customer X' });
  const site2 = yield Site.create({ name: 'Customer Y' });
  yield Site.create({ name: 'Customer Z' });

  // init device ingress paths
  yield DeviceIngressPath.remove();
  const path1 = yield DeviceIngressPath.create({ ingressPath: 'Device' });
  const path2 = yield DeviceIngressPath.create({ ingressPath: 'Software' });

  // init tags
  yield Tag.remove();
  const tag1 = yield Tag.create({ text: 'north' });
  const tag2 = yield Tag.create({ text: 'south' });
  const tag3 = yield Tag.create({ text: 'floor1' });
  const tag4 = yield Tag.create({ text: 'floor2' });

  // init devices
  yield Device.remove();
  const device1 = yield Device.create({
    name: 'device1',
    ingressPathId: path1._id,
    deviceId: '1234-5678-9012-1111',
    activationCode: 'code1',
    connectionString: 'http://xx.yy.zz',
    model: 'model',
    firmware: 'firmware',
    createdAt: new Date(),
    createdBy: 'system',
    lastDataPoint: new Date(),
    siteId: site1._id,
    tagIds: [tag1, tag2, tag3, tag4],
  });
  const device2 = yield Device.create({
    name: 'device2',
    ingressPathId: path2._id,
    deviceId: '1234-5678-9012-2222',
    activationCode: 'code2',
    connectionString: 'http://xx.yy.zz',
    model: 'model',
    firmware: 'firmware',
    createdAt: new Date(),
    createdBy: 'system',
    lastDataPoint: new Date(),
    parentId: device1._id,
    siteId: site1._id,
    tagIds: [tag1, tag3],
  });
  const device3 = yield Device.create({
    name: 'device3',
    ingressPathId: path1._id,
    deviceId: '1234-5678-9012-3333',
    activationCode: 'code3',
    connectionString: 'http://xx.yy.zz',
    model: 'model',
    firmware: 'firmware',
    createdAt: new Date(),
    createdBy: 'system',
    lastDataPoint: new Date(),
    parentId: device2._id,
    siteId: site1._id,
    tagIds: [tag2, tag4],
  });
  const device4 = yield Device.create({
    name: 'device4',
    ingressPathId: path2._id,
    deviceId: '1234-5678-9012-4444',
    activationCode: 'code4',
    connectionString: 'http://xx.yy.zz',
    model: 'model4',
    firmware: 'firmware4',
    createdAt: new Date(),
    createdBy: 'system',
    lastDataPoint: new Date(),
    parentId: device2._id,
    siteId: site1._id,
    tagIds: [tag1, tag4],
  });
  yield Device.create({
    name: 'device5',
    ingressPathId: path2._id,
    deviceId: '1234-5678-9012-5555',
    activationCode: 'code5',
    connectionString: 'http://xx.yy.zz',
    model: 'model5',
    firmware: 'firmware5',
    createdAt: new Date(),
    createdBy: 'system',
    lastDataPoint: new Date(),
    parentId: device1._id,
    siteId: site1._id,
  });
  yield Device.create({
    name: 'device6',
    ingressPathId: path1._id,
    deviceId: '1234-5678-9012-6666',
    parentId: device4._id,
    siteId: site1._id,
  });
  yield Device.create({
    name: 'device7',
    ingressPathId: path1._id,
    deviceId: '1234-5678-9012-7777',
    siteId: site1._id,
  });
  yield Device.create({
    name: 'device8',
    ingressPathId: path2._id,
    deviceId: '1234-5678-9012-8888',
    parentId: device3._id,
    siteId: site1._id,
  });

  yield Device.create({
    name: 'device9',
    ingressPathId: path2._id,
    deviceId: '1234-5678-9012-9999',
    siteId: site2._id,
  });
  yield Device.create({
    name: 'device10',
    ingressPathId: path1._id,
    deviceId: '1234-5678-9012-0000',
    siteId: site2._id,
  });

  // init MCL channels
  yield MCLChannel.remove();
  for (let i = 1; i <= 50; i++) {
    yield MCLChannel.create({
      tag: `tag${i}`,
      mclname: `name${i}`,
      lname: `long name ${i}`,
      sname: `short name ${i}`,
      unit: `unit${i}`,
      lunit: `long unit ${i}`,
      sunit: `short unit ${i}`,
      desc: `desc${i}`,
      vtype: `vtype${i}`,
      array_size: 10,
      enums: [{ s: 'sss1', v: 'vvv1' }, { s: 'sss2', v: 'vvv2' }],
      category: `category${i}`,
      lcategory: `long category ${i}`,
      scategory: `short category ${i}`,
      writable: true,
      default: `default${i}`,
      min: `min${i}`,
      max: `max${i}`,
      dynamic_minmaxdefault: false,
    });
  }

  // init device profile
  yield DeviceProfile.remove();
  for (let i = 1; i <= 10; i++) {
    yield DeviceProfile.create({
      name: `name${i}`,
      version: `version${i}`,
      vendor: `vendor${i}`,
      family: `family${i}`,
      role: `role${i}`,
      model: `model${i}`,
      model_lname: `model long name ${i}`,
      model_sname: `model short name ${i}`,
      hardware: `hardware${i}`,
      software: `software${i}`,
      channelIds: [],
      createdAt: new Date(),
      createdBy: 'system',
    });
  }

  // init adapters
  yield Adapter.remove();
  const adapter1 = yield Adapter.create({ name: 'Project Team X' });
  const adapter2 = yield Adapter.create({ name: 'Project Team Y' });
  yield Adapter.create({ name: 'Project Team Z' });

  // init operation apps
  yield OperationApp.remove();
  const operationApp1 = yield OperationApp.create({ name: 'Project Mobile App' });
  const operationApp2 = yield OperationApp.create({ name: 'Project Tablet App' });

  // init operations
  yield Operation.remove();
  const operation1 = yield Operation.create({
    name: 'operation1',
    adapterId: adapter1._id,
    description: 'description1',
    type: 'Standard',
    createdAt: new Date(),
    createdBy: 'system',
    appId: operationApp1._id,
  });
  const operation2 = yield Operation.create({
    name: 'operation2',
    adapterId: adapter1._id,
    description: 'description2',
    type: 'Standard',
    createdAt: new Date(),
    createdBy: 'system',
    appId: operationApp1._id,
  });
  const operation3 = yield Operation.create({
    name: 'operation 3 with adapter 1',
    adapterId: adapter1._id,
    description: 'description3',
    type: 'Standard',
    createdAt: new Date(),
    createdBy: 'system',
    updatedAt: new Date(),
    updatedBy: 'system',
    appId: operationApp1._id,
  });
  const operation4 = yield Operation.create({
    name: 'operation3',
    adapterId: adapter2._id,
    description: 'description3',
    type: 'Standard',
    createdAt: new Date(),
    createdBy: 'system',
    updatedAt: new Date(),
    updatedBy: 'system',
    appId: operationApp1._id,
  });
  yield Operation.create({
    name: 'operation4',
    adapterId: adapter2._id,
    description: 'description4',
    type: 'Standard',
    createdAt: new Date(),
    createdBy: 'system',
    appId: operationApp1._id,
  });
  yield Operation.create({
    name: 'operation5',
    adapterId: adapter1._id,
    description: 'description5',
    type: 'Standard',
    createdAt: new Date(),
    createdBy: 'system',
    appId: operationApp2._id,
  });
  yield Operation.create({
    name: 'operation6',
    adapterId: adapter2._id,
    description: 'description6',
    type: 'Standard',
    createdAt: new Date(),
    createdBy: 'system',
    updatedAt: new Date(),
    updatedBy: 'system',
    appId: operationApp2._id,
  });

  // init roles
  yield Role.remove();
  yield Role.create({
    name: 'role1',
    adapterId: adapter1._id,
    description: 'description1',
    createdAt: new Date(),
    createdBy: 'system',
    appId: operationApp1._id,
    operationIds: [operation1._id, operation2._id],
  });
  yield Role.create({
    name: 'role2',
    adapterId: adapter1._id,
    description: 'description2',
    createdAt: new Date(),
    createdBy: 'system',
    appId: operationApp1._id,
    operationIds: [operation1._id, operation2._id, operation3._id],
  });
  yield Role.create({
    name: 'role3',
    adapterId: adapter2._id,
    description: 'description3',
    createdAt: new Date(),
    createdBy: 'system',
    updatedAt: new Date(),
    updatedBy: 'system',
    appId: operationApp1._id,
    operationIds: [operation4._id],
  });
  yield Role.create({
    name: 'role4',
    adapterId: adapter2._id,
    description: 'description4',
    createdAt: new Date(),
    createdBy: 'system',
    appId: operationApp1._id,
    operationIds: [operation4._id],
  });
  yield Role.create({
    name: 'role5',
    adapterId: adapter1._id,
    description: 'description5',
    createdAt: new Date(),
    createdBy: 'system',
    appId: operationApp2._id,
    operationIds: [operation2._id, operation3._id],
  });
  yield Role.create({
    name: 'role6',
    adapterId: adapter2._id,
    description: 'description6',
    createdAt: new Date(),
    createdBy: 'system',
    updatedAt: new Date(),
    updatedBy: 'system',
    appId: operationApp2._id,
    operationIds: [operation4._id],
  });
}).then(() => {
  logger.info('done');
  process.exit();
}).catch((e) => {
  logger.error(e);
  logger.error(e.stack);
  process.exit();
});
