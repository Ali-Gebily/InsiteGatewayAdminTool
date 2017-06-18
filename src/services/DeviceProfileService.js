/**
 * Service for device profiles.
 */

'use strict';

const _ = require('underscore');
const Joi = require('joi');
const MCLChannel = require('../models').MCLChannel;
const DeviceProfile = require('../models').DeviceProfile;
const helper = require('../common/helper');

/**
 * Get all channels.
 * @returns {Array} the all channels
 */
function* getAllChannels() {
  return yield MCLChannel.find().sort('mclname');
}

/**
 * Search device profiles.
 * @param {Object} query the query object
 * @returns {Array} the searched device profiles
 */
function* searchDeviceProfiles(query) {
  const filter = {};
  if (query.keyword && query.keyword.length > 0) {
    filter.name = new RegExp(query.keyword, 'i');
  }
  return yield DeviceProfile.find(filter);
}

searchDeviceProfiles.schema = {
  query: Joi.object().keys({
    keyword: Joi.string(),
  }),
};

/**
 * Create device profile.
 * @param {Object} data the data to create device profile
 * @returns {Object} the created device profile
 */
function* create(data) {
  if (data.channelIds && data.channelIds.length > 0) {
    for (let i = 0; i < data.channelIds.length; i++) {
      yield helper.ensureExists(MCLChannel, data.channelIds[i]);
    }
  }
  data.createdAt = new Date();
  return yield DeviceProfile.create(data);
}

create.schema = {
  data: Joi.object().keys({
    name: Joi.string().required(),
    version: Joi.string().required(),
    vendor: Joi.string().required(),
    model: Joi.string().required(),
    channelIds: Joi.array().items(Joi.string()),
    createdBy: Joi.string().allow('', null),
  }).required(),
};

/**
 * Update device profile.
 * @param {String} id the device profile id
 * @param {Object} data the data to update device profile
 * @returns {Object} the updated device profile
 */
function* update(id, data) {
  if (data.channelIds && data.channelIds.length > 0) {
    for (let i = 0; i < data.channelIds.length; i++) {
      yield helper.ensureExists(MCLChannel, data.channelIds[i]);
    }
  }
  data.updatedAt = new Date();
  const deviceProfile = yield helper.ensureExists(DeviceProfile, id);
  _.extend(deviceProfile, data);
  return yield deviceProfile.save();
}

update.schema = {
  id: Joi.string().required(),
  data: Joi.object().keys({
    name: Joi.string().required(),
    version: Joi.string().required(),
    vendor: Joi.string().required(),
    model: Joi.string().required(),
    channelIds: Joi.array().items(Joi.string()),
    updatedBy: Joi.string().allow('', null),
  }).required(),
};

/**
 * Get device profile.
 * @param {String} id the device profile id
 * @returns {Object} the got device profile
 */
function* get(id) {
  return yield helper.ensureExists(DeviceProfile, id);
}

get.schema = {
  id: Joi.string().required(),
};

/**
 * Get device profile download content.
 * @param {String} id the device profile id
 * @returns {String} the device profile download content
 */
function* download(id) {
  const profile = yield helper.ensureExists(DeviceProfile, id);
  const res = {
    _id: profile._id,
    name: profile.name,
    version: profile.version,
    device: {
      vendor: profile.vendor,
      family: profile.family,
      role: profile.role,
      model: profile.model,
      model_lname: profile.model_lname,
      model_sname: profile.model_sname,
      hardware: profile.hardware,
      software: profile.software,
    },
    channels: [],
  };
  if (profile.channelIds && profile.channelIds.length > 0) {
    const channels = yield MCLChannel.find({ _id: { $in: profile.channelIds } });
    res.channels = _.map(channels, (ch) => {
      const c = ch.toJSON();
      delete c.id;
      _.each(c.enums, (item) => {
        delete item._id;
      });
      return c;
    });
  }
  return JSON.stringify(res, null, 4);
}

// Exports
module.exports = {
  getAllChannels,
  searchDeviceProfiles,
  create,
  update,
  get,
  download,
};
