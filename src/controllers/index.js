const controllers = {};

controllers.auth = require('./auth.controller');
controllers.master = require('./master.controller');
controllers.client = require('./client.controller');
controllers.get = require('./get.controller')

module.exports = controllers;