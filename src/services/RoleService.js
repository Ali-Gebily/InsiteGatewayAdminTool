/**
 * Service for roles.
 */

'use strict';

const _ = require('underscore');
const Joi = require('joi');
const Adapter = require('../models').Adapter;
const Role = require('../models').Role;
const RoleApp = require('../models').App;
const Operation = require('../models').Operation;
const helper = require('../common/helper');

/**
 * Get roles by adapter id.
 * @param {String} adapterId the adapter id
 * @returns {Array} the roles of the given adapter id
 */
function* getRolesByAdapterId(adapterId) {
  yield helper.ensureExists(Adapter, adapterId);
  return yield Role.find({ adapterId });
}

getRolesByAdapterId.schema = {
  adapterId: Joi.string().required(),
};

/**
 * Create Role.
 * @param {Object} data the data to create Role
 * @returns {Object} the created Role
 */
function* create(data) {
  yield [
    helper.ensureExists(RoleApp, data.appId),
    helper.ensureExists(Adapter, data.adapterId),
  ];
  if (data.operationIds && data.operationIds.length > 0) {
    for (let i = 0; i < data.operationIds.length; i++) {
      yield helper.ensureExists(Operation, data.operationIds[i]);
    }
  }

  data.createdAt = new Date();
  return yield Role.create(data);
}

create.schema = {
  data: Joi.object().keys({
    name: Joi.string().required(),
    appId: Joi.string().required(),
    adapterId: Joi.string().required(),
    description: Joi.string().required(),
    operationIds: Joi.array().items(Joi.string()),
    createdBy: Joi.string().allow('', null),
  }).required(),
};

/**
 * Update Role.
 * @param {String} roleId the Role id
 * @param {Object} data the data to update Role
 * @returns {Object} the updated Role
 */
function* update(roleId, data) {
  const result = yield [
    helper.ensureExists(Role, roleId),
    helper.ensureExists(RoleApp, data.appId),
    helper.ensureExists(Adapter, data.adapterId),
  ];
  if (data.operationIds && data.operationIds.length > 0) {
    for (let i = 0; i < data.operationIds.length; i++) {
      yield helper.ensureExists(Operation, data.operationIds[i]);
    }
  }
  data.updatedAt = new Date();
  const role = result[0];
  _.extend(role, data);
  return yield role.save();
}

update.schema = {
  roleId: Joi.string().required(),
  data: Joi.object().keys({
    name: Joi.string().required(),
    appId: Joi.string().required(),
    adapterId: Joi.string().required(),
    description: Joi.string().required(),
    operationIds: Joi.array().items(Joi.string()),
    updatedBy: Joi.string().allow('', null),
  }).required(),
};

/**
 * Get Role.
 * @param {String} roleId the Role id
 * @returns {Object} the got Role
 */
function* get(roleId) {
  return yield helper.ensureExists(Role, roleId);
}

get.schema = {
  roleId: Joi.string().required(),
};

/**
 * Delete Role.
 * @param {String} roleId the Role id
 */
function* remove(roleId) {
  const role = yield helper.ensureExists(Role, roleId);
  role.remove();
}

remove.schema = get.schema;

// Exports
module.exports = {
  getRolesByAdapterId,
  create,
  update,
  get,
  remove,
};
