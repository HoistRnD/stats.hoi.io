'use strict';
var express = require('express'),
	winston = require('winston'),
	config = require('config'),
	passport = require('passport'),
	RedisStore = require('connect-redis')(express),
	expressWinston = require('express-winston'),
	raygun = require('raygun'),
    raygunClient = new raygun.Client().init({
        apiKey: config.raygun.key
    });

var allowCrossDomain = function(req, res, next) {
	if (req.headers['origin']) {
		res.header('Access-Control-Allow-Origin', req.headers['origin']);
	} else {
		res.header('Access-Control-Allow-Origin', "*");
	}
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	var allowHeaders = 'Content-Type, authorize';
	if (req.headers['access-control-request-headers']) {
		allowHeaders = req.headers['access-control-request-headers'];
	}
	res.header('Access-Control-Allow-Headers', allowHeaders);
	res.header('Access-Control-Allow-Credentials', 'true');
	next();
};

module.exports = function(app) {
	app.disable('x-powered-by');
	app.use(express.json());
	app.use(express.logger('dev'));
	app.use(express.urlencoded());
	app.use(express.methodOverride());
	app.use(express.cookieParser());
	app.use(express.session({
		store: new RedisStore({
			host: config.redis.host,
			port: config.redis.port,
			db: 10,
			ttl: 5400
		}),
		cookie: {
			path: '/',
			httpOnly: true,
			//maxAge: 3600000
			domain: config.session.domain
		},
		secret: config.session.secret,
		key: 'hoist-session'
	}));



	app.use(passport.initialize({
		userProperty: 'application'
	}));

	app.use(passport.session());

	if (config.debug) {
		app.use(expressWinston.logger({
			transports: [
				new winston.transports.Console({
					json: true,
					colorize: true
				}),
				new(winston.transports.File)({
					filename: 'log/requests.log'
				})
			]
		}));
	}
	app.use(allowCrossDomain);
	app.use(app.router);

	app.use(expressWinston.errorLogger({
		transports: [
			new winston.transports.Console({
				json: true,
				colorize: true
			}),
			new(winston.transports.File)({
				filename: 'log/error.log'
			})
		]
	}));
	
	

	if (config.debug) {
		app.use(express.errorHandler());
	}
	if(config.raygun.enabled)
	{
		app.use(raygunClient.expressHandler);
	}
};