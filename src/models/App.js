/**
 * This defines operation app model.
 */
'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  name: { type: String, required: true, unique: true },
});

schema.index({ name: 1 });

module.exports = schema;
