/* WebApp: Starts a HTTP Server
 * Prints Hello World
 * Prints IP, if the Feature Flag is Set
 */

"use strict";

// Imports
const express = require('express');
const redis = require('redis');

// Globals
const PORT = 80;

// Read Config File
var config = require('./config.js');

// Setup Express
var app = express();

// Setup Redis
var redisClient = redis.createClient(6379, config.REDIS_IP, {});

// Routing
app.get('/', function(req, res) {
		res.write("Hello Devs!\n");
	redisClient.get('featureFlag', function(err, val) {
			if (err) res.send(err);
			else if (val == 'set') res.write("My IP Is: " + config.MY_IP);
		   res.end();	
	});
});

// Start HTTP Server
app.listen(PORT, function() {
		console.log("Server Up and Running on Port: " + PORT);
});

