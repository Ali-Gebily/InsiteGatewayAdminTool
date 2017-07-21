/**
 * This defines operation model.
 */
'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const schema = new Schema({
  name: { type: String, required: true },
  appId: { type: ObjectId, ref: 'OperationApp', required: true },
  description: { type: String, required: true },
  createdAt: Date,
  updatedAt: Date,
  createdBy: String,
  updatedBy: String,
  adapterId: { type: ObjectId, ref: 'Adapter', required: true },
  operationIds: [{ type: ObjectId, ref: 'Operation', required: true }],
});

schema.index({ appId: 1 });
schema.index({ adapterId: 1 });

module.exports = schema;
