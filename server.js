/* WebApp: Starts a HTTP Server
 * Prints Hello World
 * Prints IP, if the Feature Flag is Set
 */

"use strict";

// Imports
const express = require('express');
const redis = require('redis');
const fs = require('fs');
const publicIP = require('public-ip');

// Globals
const PORT = 8000;

// Read Config File
var config = JSON.parse(fs.readFileSync('config.json'));

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
var server = app.listen(PORT, function() {
    console.log("Server Up and Running on Port: " + PORT);
});

publicIP.v4().then(ip => {
    redisClient.lpush("production_servers", ip);
});

