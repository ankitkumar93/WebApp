/*
    Author: Ankit Kumar
    Contains Functions for Digital Ocean Server Provisioning
*/

// Imports
var needle = require('needle'),
fs = require('fs'),
token = require('./token.js');

/*
    Data Files (Inventory, Config, Host)
*/

var config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

var headers = {
    'Content-Type': config.contenttype,
    'Authorization': config.authorization + token
};

// Provision a Server Instance
var getInstance = function(){
    var url = "https://api.digitalocean.com/v2/droplets";
    needle.post(url, config.data, {headers:headers,json:true}, function(err, res){
        if (!err && res.statusCode == 202){
            var hostID = res.body.droplet.id;
            genInventory(hostID);
        }else{
            if(err)
                console.log("Error: " + err);
            else
                console.log("Error, Response Code: " + res.statusCode);
        }
    });
};

// Generate an Inventory File
var genInventory = function(hostID){
    var url = "https://api.digitalocean.com/v2/droplets/" + hostID;
    needle.get(url, {headers:headers,json:true}, function(err, res){
        if (!err && res.statusCode == 200){
            if( res.body.droplet.status != 'active'){
                genInventory(hostID);
            }else{
                var hostIP = res.body.droplet.networks.v4[0].ip_address;
                console.log(hostIP);
            }
        }
        else{
            if(err)
                console.log("Error: " + err);
            else
                console.log("Error, Response Code: " + res.statusCode);
        }
    });
};

getInstance();