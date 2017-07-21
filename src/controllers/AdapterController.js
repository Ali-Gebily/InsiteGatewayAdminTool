/**
 * Contains endpoints related to adapters.
 */
'use strict';

const AdapterService = require('../services/AdapterService');

/**
 * Get all adapters.
 * @param req the request
 * @param res the response
 */
function* getAll(req, res) {
  res.json(yield AdapterService.getAll());
}

// Exports
module.exports = {
  getAll,
};
