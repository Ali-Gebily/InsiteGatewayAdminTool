/**
 * This defines MCL channel model.
 */
'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EnumItemSchema = new Schema({
  s: { type: String, required: true },
  v: { type: String, required: true },
});

const schema = new Schema({
  tag: { type: String, required: true, unique: true },
  mclname: String,
  lname: String,
  sname: String,
  unit: String,
  lunit: String,
  sunit: String,
  desc: String,
  vtype: String,
  array_size: Number,
  enums: [EnumItemSchema],
  category: String,
  lcategory: String,
  scategory: String,
  writable: Boolean,
  default: String,
  min: String,
  max: String,
  dynamic_minmaxdefault: Boolean,
});

module.exports = schema;
