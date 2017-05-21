/**
 * This defines device model.
 */
'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const schema = new Schema({
  name: { type: String, required: true },
  ingressPathId: { type: ObjectId, ref: 'DeviceIngressPath', required: true },
  deviceId: { type: String, required: true, unique: true },
  activationCode: String,
  connectionString: String,
  model: String,
  firmware: String,
  createdAt: Date,
  updatedAt: Date,
  createdBy: String,
  updatedBy: String,
  lastDataPoint: Date,
  // this references the mongo id, not device id
  parentId: { type: ObjectId, ref: 'Device', required: false },
  siteId: { type: ObjectId, ref: 'Site', required: true },
});

schema.index({ siteId: 1 });
schema.index({ deviceId: 1 });

module.exports = schema;
