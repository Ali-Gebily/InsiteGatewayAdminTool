/**
 * Init app
 */

'use strict';

global.Promise = require('bluebird');
const logger = require('./common/logger');

logger.buildService(require('./services/UserService'));
logger.buildService(require('./services/SiteService'));
logger.buildService(require('./services/DeviceService'));
logger.buildService(require('./services/DeviceProfileService'));
logger.buildService(require('./services/TagService'));
