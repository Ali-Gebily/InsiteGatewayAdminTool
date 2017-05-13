/**
 * Service for sites.
 */

'use strict';

const Site = require('../models').Site;

/**
 * Get all sites.
 * @returns {Array} all sites
 */
function* getAll() {
  return yield Site.find();
}

// Exports
module.exports = {
  getAll,
};
