/**
 * Service for tags.
 */

'use strict';

const Tag = require('../models').Tag;

/**
 * Get all tags.
 * @returns {Array} all tags
 */
function* getAll() {
  return yield Tag.find();
}

// Exports
module.exports = {
  getAll,
};
