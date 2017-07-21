/**
 * Service for adapters.
 */

'use strict';

const Adapter = require('../models').Adapter;

/**
 * Get all adapters.
 * @returns {Array} all adapters
 */
function* getAll() {
  return yield Adapter.find();
}

// Exports
module.exports = {
  getAll,
};
