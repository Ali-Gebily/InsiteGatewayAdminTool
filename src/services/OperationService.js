/**
 * Service for operations.
 */

'use strict';

const _ = require('underscore');
const Joi = require('joi');
const Adapter = require('../models').Adapter;
const Operation = require('../models').Operation;
const OperationApp = require('../models').App;
const helper = require('../common/helper');

/**
 * Get operations by adapter id.
 * @param {String} adapterId the adapter id
 * @returns {Array} the operations of the given adapter id
 */
function* getOperationsByAdapterId(adapterId) {
  yield helper.ensureExists(Adapter, adapterId);
  return yield Operation.find({ adapterId });
}

getOperationsByAdapterId.schema = {
  adapterId: Joi.string().required(),
};

/**
 * Create Operation.
 * @param {Object} data the data to create Operation
 * @returns {Object} the created Operation
 */
function* create(data) {
  yield [
    helper.ensureExists(OperationApp, data.appId),
    helper.ensureExists(Adapter, data.adapterId),
  ];
  data.type = 'custom';
  data.createdAt = new Date();
  return yield Operation.create(data);
}

create.schema = {
  data: Joi.object().keys({
    name: Joi.string().required(),
    appId: Joi.string().required(),
    adapterId: Joi.string().required(),
    description: Joi.string().required(),
    createdBy: Joi.string().allow('', null),
  }).required(),
};

/**
 * Update Operation.
 * @param {String} operationId the Operation id
 * @param {Object} data the data to update Operation
 * @returns {Object} the updated Operation
 */
function* update(operationId, data) {
  const result = yield [
    helper.ensureExists(Operation, operationId),
    helper.ensureExists(OperationApp, data.appId),
    helper.ensureExists(Adapter, data.adapterId),
  ];

  data.updatedAt = new Date();
  const operation = result[0];
  data.type = operation.type;
  _.extend(operation, data);
  return yield operation.save();
}

update.schema = {
  operationId: Joi.string().required(),
  data: Joi.object().keys({
    name: Joi.string().required(),
    appId: Joi.string().required(),
    adapterId: Joi.string().required(),
    description: Joi.string().required(),
    updatedBy: Joi.string().allow('', null),
  }).required(),
};

/**
 * Get Operation.
 * @param {String} operationId the Operation id
 * @returns {Object} the got Operation
 */
function* get(operationId) {
  return yield helper.ensureExists(Operation, operationId);
}

get.schema = {
  operationId: Joi.string().required(),
};

/**
 * Delete Operation.
 * @param {String} operationId the Operation id
 */
function* remove(operationId) {
  const operation = yield helper.ensureExists(Operation, operationId);
  operation.remove();
}

remove.schema = get.schema;

// Exports
module.exports = {
  getOperationsByAdapterId,
  create,
  update,
  get,
  remove,
};
