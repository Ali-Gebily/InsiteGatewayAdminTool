/**
 * Contains endpoints related to device profiles.
 */
'use strict';

const DeviceProfileService = require('../services/DeviceProfileService');

/**
 * Get all channels.
 * @param req the request
 * @param res the response
 */
function* getAllChannels(req, res) {
  res.json(yield DeviceProfileService.getAllChannels());
}

/**
 * Search device profiles.
 * @param req the request
 * @param res the response
 */
function* searchDeviceProfiles(req, res) {
  res.json(yield DeviceProfileService.searchDeviceProfiles(req.query));
}

/**
 * Get device profile by id.
 * @param req the request
 * @param res the response
 */
function* get(req, res) {
  res.json(yield DeviceProfileService.get(req.params.id));
}

/**
 * Create device profile.
 * @param req the request
 * @param res the response
 */
function* create(req, res) {
  res.json(yield DeviceProfileService.create(req.body));
}

/**
 * Update device profile.
 * @param req the request
 * @param res the response
 */
function* update(req, res) {
  res.json(yield DeviceProfileService.update(req.params.id, req.body));
}

/**
 * Download device profile.
 * @param req the request
 * @param res the response
 */
function* download(req, res) {
  const data = yield DeviceProfileService.download(req.params.id);
  res.attachment(`device-profile-${req.params.id}.json`);
  res.send(data);
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
