'use strict';
/**
 * Module dependencies.
 */

var express = require('express'),
	routes = require('./app/routes'),
	config = require('config');

if(!config.debug){
	require('newrelic');
}

var hoist = require('hoist-core');
hoist.init();
hoist.auth.init();


var app = express();
require('./config/express')(app);

routes(app);

module.exports = app;