/**
 * The application entry point
 */
'use strict';

require('./bootstrap');
const path = require('path');
const config = require('config');
const express = require('express');
const winston = require('winston');
const _ = require('underscore');
const cors = require('cors');
const bodyParser = require('body-parser');
const helper = require('./common/helper');
const logger = require('./common/logger');

const app = express();
app.set('port', config.PORT);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// static content
app.use(express.static(path.join(__dirname, '../public')));

const apiRouter = express.Router();

// load all routes
_.each(require('./routes'), (verbs, url) => {
  _.each(verbs, (def, verb) => {
    const actions = [];
    const method = require('./controllers/' + def.controller)[def.method];
    if (!method) {
      throw new Error(def.method + ' is undefined');
    }
    actions.push(method);
    apiRouter[verb](url, helper.autoWrapExpress(actions));
  });
});

app.use('/api/v1', apiRouter);
app.use((req, res) => {
  res.status(404).json({ error: 'route not found' });
});

app.use((err, req, res, next) => { // eslint-disable-line
  logger.logFullError(err, req.method, req.url);
  let status = err.httpStatus || 500;
  if (err.isJoi) {
    status = 400;
  }
  res.status(status);
  if (err.isJoi) {
    res.json({
      error: 'Validation failed',
      details: err.details,
    });
  } else {
    res.json({
      error: err.message,
    });
  }
});

if (!module.parent) {
  app.listen(app.get('port'), () => {
    winston.info(`Express server listening on port ${app.get('port')}`);
  });
} else {
  // for testing
  module.exports = app;
}
