/* WebApp: Starts a HTTP Server
 * Prints Hello World
 * Prints IP, if the Feature Flag is Set
 */

// Imports
var express = require('express');
var redis = require('redis');
var fs = require('fs');
var publicIP = require('external-ip')();

// Globals
var PORT = 8080;

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
publicIP(function(error, ip) {
		redisClient.lpush("production_servers", ip);
});
