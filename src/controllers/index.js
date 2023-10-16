const controllers = {};

controllers.auth = require('./auth.controller');
controllers.master = require('./master.controller');
controllers.client = require('./client.controller');

module.exports = controllers;