/**
 * Contains endpoints related to apps.
 */
'use strict';

const AppService = require('../services/AppService');

/**
 * Get all apps.
 * @param req the request
 * @param res the response
 */
function* getAll(req, res) {
  res.json(yield AppService.getAll());
}

// Exports
module.exports = {
  getAll,
};
