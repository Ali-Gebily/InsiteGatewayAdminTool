/**
 * Service for users.
 */

'use strict';

const _ = require('underscore');
const Joi = require('joi');
const User = require('../models').User;
const helper = require('../common/helper');

const DEFAULT_SIZE = 1000;

/**
 * Search users.
 * @param {Object} query the query parameters
 * @returns {Object} the searched users
 */
function* search(query) {
  const q = query || {};
  const filter = {};
  if (q.name && q.name.length > 0) {
    filter.displayName = new RegExp(q.name);
  }
  if (q.email && q.email.length > 0) {
    filter.email = q.email;
  }
  return yield User.find(filter).sort('displayName').skip(Number(q.offset || 0)).limit(Number(q.size || DEFAULT_SIZE));
}

search.schema = {
  query: Joi.object().keys({
    offset: Joi.number().integer().min(0),
    size: Joi.number().integer().min(1),
    name: Joi.string(),
    email: Joi.string(),
  }),
};

/**
 * Create user.
 * @param {Object} data the data to create user
 * @returns {Object} the created user
 */
function* create(data) {
  data.createdAt = new Date();
  // hash password
  data.password = yield helper.hashString(data.password);
  return yield User.create(data);
}

create.schema = {
  data: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
    displayName: Joi.string().required(),
    jobTitle: Joi.string().allow(''),
    department: Joi.string().allow(''),
    phoneNumber: Joi.string().allow(''),
    accountEnabled: Joi.string().allow(''),
    createdBy: Joi.string().allow(''),
  }).required(),
};

/**
 * Update user.
 * @param {String} userId the user id
 * @param {Object} data the data to update user
 * @returns {Object} the updated user
 */
function* update(userId, data) {
  data.updatedAt = new Date();
  // hash password
  data.password = yield helper.hashString(data.password);
  const user = yield helper.ensureExists(User, userId);
  _.extend(user, data);
  return yield user.save();
}

update.schema = {
  userId: Joi.string().required(),
  data: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
    displayName: Joi.string().required(),
    jobTitle: Joi.string().allow(''),
    department: Joi.string().allow(''),
    phoneNumber: Joi.string().allow(''),
    accountEnabled: Joi.string().allow(''),
    updatedBy: Joi.string().allow(''),
  }).required(),
};

/**
 * Get user.
 * @param {String} userId the user id
 * @returns {Object} the got user
 */
function* get(userId) {
  return yield helper.ensureExists(User, userId);
}

get.schema = {
  userId: Joi.string().required(),
};

// Exports
module.exports = {
  search,
  create,
  update,
  get,
};
