/**
 * Contains endpoints related to sites.
 */
'use strict';

const SiteService = require('../services/SiteService');

/**
 * Get all sites.
 * @param req the request
 * @param res the response
 */
function* getAll(req, res) {
  res.json(yield SiteService.getAll());
}

// Exports
module.exports = {
  getAll,
};
