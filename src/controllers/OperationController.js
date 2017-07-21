/**
 * Contains endpoints related to operations.
 */
'use strict';

const OperationService = require('../services/OperationService');

/**
 * Create operation.
 * @param req the request
 * @param res the response
 */
function* create(req, res) {
  res.json(yield OperationService.create(req.body));
}

/**
 * Get operations by adapter id.
 * @param req the request
 * @param res the response
 */
function* getOperationsByAdapterId(req, res) {
  res.json(yield OperationService.getOperationsByAdapterId(req.params.adapterId));
}

/**
 * Update operation.
 * @param req the request
 * @param res the response
 */
function* update(req, res) {
  res.json(yield OperationService.update(req.params.id, req.body));
}

/**
 * Get operation.
 * @param req the request
 * @param res the response
 */
function* get(req, res) {
  res.json(yield OperationService.get(req.params.id));
}

/**
 * Delete operation.
 * @param req the request
 * @param res the response
 */
function* remove(req, res) {
  res.json(yield OperationService.remove(req.params.id));
}

// Exports
module.exports = {
  getOperationsByAdapterId,
  create,
  update,
  get,
  remove,
};
