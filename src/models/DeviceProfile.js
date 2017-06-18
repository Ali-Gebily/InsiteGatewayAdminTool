/**
 * This defines device profile model.
 */
'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const schema = new Schema({
  name: { type: String, required: true },
  version: { type: String, required: true },
  vendor: { type: String, required: true },
  family: String,
  role: String,
  model: { type: String, required: true },
  model_lname: String,
  model_sname: String,
  hardware: String,
  software: String,
  channelIds: [{ type: ObjectId, ref: 'MCLChannel', required: true }],
  createdAt: Date,
  updatedAt: Date,
  createdBy: String,
  updatedBy: String,
});

module.exports = schema;
