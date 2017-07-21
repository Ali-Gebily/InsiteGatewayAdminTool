/**
 * Service for apps.
 */

'use strict';

const App = require('../models').App;

/**
 * Get all apps.
 * @returns {Array} all apps
 */
function* getAll() {
  return yield App.find();
}

// Exports
module.exports = {
  getAll,
};
