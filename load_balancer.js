var redis = require('redis')
var express = require('express')
var config = require('./config.json')
var app = express()

var server = app.listen(3000, function () {
  var host = server.address().address
  var port = server.address().port
  console.log('Proxy server listening at http://%s:%s', host, port)
})

var client = redis.createClient(6379, config.REDIS_IP, {});

var counter = 0;
var routeToCanary = false;

app.get('/', function(req, res){
  client.get("canary_on", function(error, value){
		if(!error){
      if(value == "true"){
        routeToCanary = true;
      }
      counter++;
      //send every 4th request (25% traffic) to canary server
      if(counter % 4 == 0){
        client.get("canary_url", function(error, canary_url){
          if(!error){
            res.redirect(canary_url);
          } else{
            res.send("Error while getting canary_url from Redis server!");
          }
        })
      }else{
        client.rpoplpush("production_servers", "production_servers", function(error, production_url){
          if(!error){
              res.redirect(production_url);
          } else{
            res.send("Error while getting production_url from Redis server!");
          }
        });
      }

    }else{
      res.send("Error while getting canary_on flag from Redis server!");
    }
	})
});
