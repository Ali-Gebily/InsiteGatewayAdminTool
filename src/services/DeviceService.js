/**
 * Service for devices.
 */

'use strict';

const _ = require('underscore');
const Joi = require('joi');
const Site = require('../models').Site;
const Device = require('../models').Device;
const DeviceIngressPath = require('../models').DeviceIngressPath;
const helper = require('../common/helper');

/**
 * Get devices by site id.
 * @param {String} siteId the site id
 * @returns {Array} the devices of the given site id
 */
function* getDevicesBySiteId(siteId) {
  yield helper.ensureExists(Site, siteId);
  return yield Device.find({ siteId });
}

getDevicesBySiteId.schema = {
  siteId: Joi.string().required(),
};

/**
 * Get devices by tags.
 * @param {Array} tags the tags to search by
 * @returns {Array} the devices of the given site id
 */
function* getDevicesByTags(tags) {
  return yield Device.find({ tagIds: { $in: tags } });
}
getDevicesByTags.schema = {
  tags: Joi.array().items(Joi.string()),
};

/**
 * Create device. Note that if deviceId is not provided, then it will be generated.
 * @param {Object} data the data to create device
 * @returns {Object} the created device
 */
function* create(data) {
  yield helper.ensureExists(DeviceIngressPath, data.ingressPathId);
  if (data.parentId) {
    yield helper.ensureExists(Device, data.parentId);
  }
  yield helper.ensureExists(Site, data.siteId);
  data.createdAt = new Date();
  // generate device id if it is not provided
  if (!data.deviceId) {
    data.deviceId = helper.generateDeviceId();
  }
  return yield Device.create(data);
}

create.schema = {
  data: Joi.object().keys({
    name: Joi.string().required(),
    ingressPathId: Joi.string().required(),
    // if deviceId is not provided, then it will be generated
    deviceId: Joi.string(),
    activationCode: Joi.string().allow('', null),
    connectionString: Joi.string().allow('', null),
    model: Joi.string().allow('', null),
    firmware: Joi.string().allow('', null),
    createdBy: Joi.string().allow('', null),
    lastDataPoint: Joi.date().iso(),
    parentId: Joi.string(),
    siteId: Joi.string().required(),
    tagIds: Joi.array().items(Joi.string()),
  }).required(),
};

/**
 * Update device. When any optional device field is not provided, the field is not changed.
 * @param {String} deviceId the device id
 * @param {Object} data the data to update device
 * @returns {Object} the updated device
 */
function* update(deviceId, data) {
  yield helper.ensureExists(DeviceIngressPath, data.ingressPathId);
  if (data.parentId) {
    yield helper.ensureExists(Device, data.parentId);
  }
  yield helper.ensureExists(Site, data.siteId);
  data.updatedAt = new Date();
  const device = yield helper.ensureExists(Device, deviceId);
  _.extend(device, data);
  return yield device.save();
}

update.schema = {
  deviceId: Joi.string().required(),
  data: Joi.object().keys({
    name: Joi.string().required(),
    ingressPathId: Joi.string().required(),
    deviceId: Joi.string(),
    activationCode: Joi.string().allow('', null),
    connectionString: Joi.string().allow('', null),
    model: Joi.string().allow('', null),
    firmware: Joi.string().allow('', null),
    updatedBy: Joi.string().allow('', null),
    lastDataPoint: Joi.date().iso(),
    parentId: Joi.string(),
    siteId: Joi.string().required(),
    tagIds: Joi.array().items(Joi.string()),
  }).required(),
};

/**
 * Get device.
 * @param {String} deviceId the device id
 * @returns {Object} the got device
 */
function* get(deviceId) {
  return yield helper.ensureExists(Device, deviceId);
}

get.schema = {
  deviceId: Joi.string().required(),
};

/**
 * Get all device ingress paths.
 * @returns {Array} all device ingress paths
 */
function* getAllDeviceIngressPaths() {
  return yield DeviceIngressPath.find();
}

// Exports
module.exports = {
  getDevicesBySiteId,
  getDevicesByTags,
  create,
  update,
  get,
  getAllDeviceIngressPaths,
};
