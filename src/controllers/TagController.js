/**
 * Contains endpoints related to tags.
 */
'use strict';

const TagService = require('../services/TagService');

/**
 * Get all tags.
 * @param req the request
 * @param res the response
 */
function* getAll(req, res) {
  res.json(yield TagService.getAll());
}

// Exports
module.exports = {
  getAll,
};
