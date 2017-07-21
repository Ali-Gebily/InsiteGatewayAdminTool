/**
 * Contains endpoints related to roles.
 */
'use strict';

const RoleService = require('../services/RoleService');

/**
 * Create role.
 * @param req the request
 * @param res the response
 */
function* create(req, res) {
  res.json(yield RoleService.create(req.body));
}

/**
 * Get roles by adapter id.
 * @param req the request
 * @param res the response
 */
function* getRolesByAdapterId(req, res) {
  res.json(yield RoleService.getRolesByAdapterId(req.params.adapterId));
}

/**
 * Update role.
 * @param req the request
 * @param res the response
 */
function* update(req, res) {
  res.json(yield RoleService.update(req.params.id, req.body));
}

/**
 * Get role.
 * @param req the request
 * @param res the response
 */
function* get(req, res) {
  res.json(yield RoleService.get(req.params.id));
}

/**
 * Delete role.
 * @param req the request
 * @param res the response
 */
function* remove(req, res) {
  res.json(yield RoleService.remove(req.params.id));
}

// Exports
module.exports = {
  getRolesByAdapterId,
  create,
  update,
  get,
  remove,
};
