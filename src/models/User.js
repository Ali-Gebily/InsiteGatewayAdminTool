/**
 * This defines user model.
 */
'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  email: { type: String, required: true, unique: true },
  // hashed password
  password: { type: String, required: true },
  displayName: { type: String, required: true },
  jobTitle: String,
  department: String,
  phoneNumber: String,
  accountEnabled: String,
  createdAt: Date,
  updatedAt: Date,
  createdBy: String,
  updatedBy: String,
});

schema.index({ email: 1 });

module.exports = schema;
