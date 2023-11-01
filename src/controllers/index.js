const controllers = {};

controllers.auth = require('./auth.controller');
controllers.master = require('./master.controller');
controllers.client = require('./client.controller');
controllers.api = require('./api.controller');
controllers.support = require('./support.controller');

module.exports = controllers;