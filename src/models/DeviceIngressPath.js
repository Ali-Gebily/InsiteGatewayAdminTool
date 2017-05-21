/**
 * This defines device ingress path model.
 */
'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  ingressPath: { type: String, required: true, unique: true },
});

schema.index({ ingressPath: 1 });

module.exports = schema;
