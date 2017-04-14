/**
 * Contains endpoints related to users.
 */
'use strict';

const UserService = require('../services/UserService');

// Exports
module.exports = {
  search,
  create,
  update,
  get,
};

/**
 * Create user.
 * @param req the request
 * @param res the response
 */
function* create(req, res) {
  res.json(yield UserService.create(req.body));
}

/**
 * Search users.
 * @param req the request
 * @param res the response
 */
function* search(req, res) {
  res.json(yield UserService.search(req.query));
}

/**
 * Update user.
 * @param req the request
 * @param res the response
 */
function* update(req, res) {
  res.json(yield UserService.update(req.params.id, req.body));
}

/**
 * Get user.
 * @param req the request
 * @param res the response
 */
function* get(req, res) {
  res.json(yield UserService.get(req.params.id));
}
