//Changes
//


//Including the modules
var port = 8000;
var fs = require ("fs");
var url = require("url");
var http = require("http");
var connect = require('connect');
var qs = require('querystring');

var reqData = '';

//Creating the server
http.createServer(function(req,res){	
	var pathName = url.parse(req.url).pathname;
	
	 if (req.method == 'POST') {
         var body = '';
         
         req.on('data', function (data) {
        	 body += data;
         });
         req.on('end', function () {
        	reqData = qs.parse(body);
            
        	reqData = JSON.parse(reqData['data']);

        	routePath(req, res, pathName);
         });
     }
	 else {
		 routePath(req, res, pathName);
	 }

}).listen(port, '127.0.0.1');

//Adding routes to the server
function routePath(req, res, pathName){
	
	if(pathName === '/' || pathName === '/index.html'){
		res.writeHead(200, {"Content-Type": "text/html"});
		fs.readFile('./index.html', 'utf8', function(err, contents) {
			res.end(contents);
		});	
	}
	
	//Network Paths
	else if(pathName === '/network.html'){

		res.writeHead(200, {"Content-Type": "text/html"});
		fs.readFile('./View/network.html', 'utf8', function(err, contents) {
			var Network = require("./Model/Network.js");
			//Network.showNetworks();	//You need to use exports.showNetworks = function(){} in Network.js file if this is enabled
			res.end(contents);
		});
	}
	else if(pathName === '/Network.js'){
		var Network = require("./Model/Network.js");
		
		if(reqData.action && reqData.action == "getExistingNetworksTable" ) {
			Network.getExistingNetworksTable(res);
		}
		else if(reqData.action && reqData.action == "connectNetwork" ) {
			Network.connectNetwork(res, reqData);
		}
		else if(reqData.action && reqData.action == "disconnectNetwork" ) {
			Network.disconnectNetwork(res, reqData);
		}
		else if(reqData.action && reqData.action == "disconnectIndividualNetworks" ) {
			Network.disconnectIndividualNetworks(res, reqData);
		}
		else if(reqData.action && reqData.action == "createNetwork" ) {
			Network.createNetwork(res, reqData);
		}
		else {
			console.log("ERROR: NETWORK Action Not Defined");
		}
	}
	
	//Device Paths
	else if(pathName === '/device.html'){
		res.writeHead(200, {"Content-Type": "text/html"});
		fs.readFile('./View/device.html', 'utf8', function(err, contents) {
			var Device = require("./Model/Device.js");
			res.end(contents);
		});	
	}
	
	else if(pathName === '/Device.js'){
		var Device = require("./Model/Device.js");
		
		if(reqData.action && reqData.action == "getExistingDevicesTable" ) {
			Device.getExistingDevicesTable(res);
		}
		else if(reqData.action && reqData.action == "addDevice" ) {
			Device.addDevice(res, reqData);
		}
		else if(reqData.action && reqData.action == "removeDevice" ) {
			Device.removeDevice(res, reqData);
		}
		else if(reqData.action && reqData.action == "getDeviceNames" ) {
			Device.getDeviceNames(res, reqData);
		}
		else if(reqData.action && reqData.action == "getNetworkNames" ) {
			Device.getNetworkNames(res, reqData);
		}
		else if(reqData.action && reqData.action == "joinNetwork" ) {
			Device.joinNetwork(res, reqData);
		}
		else {
			console.log("ERROR: DEVICE Action Not Defined");
		}
	}
	
	//NetworkDevices Paths
	else if(pathName === '/networkdevices.html'){
		res.writeHead(200, {"Content-Type": "text/html"});
		fs.readFile('./View/networkdevices.html', 'utf8', function(err, contents) {
			var NetworkDevices = require("./Model/NetworkDevices.js");
			res.end(contents);
		});
	}
	else if(pathName === '/NetworkDevices.js'){
		var NetworkDevices = require("./Model/NetworkDevices.js");
		
		if(reqData.action && reqData.action == "getExistingNetworkDevicesTable" ) {
			NetworkDevices.getExistingNetworkDevicesTable(res);
		}
		else if(reqData.action && reqData.action == "getConnectedNetworkNames" ) {
			NetworkDevices.getConnectedNetworkNames(res, reqData);
		}
		else if(reqData.action && reqData.action == "removeDeviceFromNetwork" ) {
			NetworkDevices.removeDeviceFromNetwork(res, reqData);
		}
		else {
			console.log("ERROR: NETWORKD DEVICES Action Not Defined");
		}
	}
	
	
	//Application Paths
	else if(pathName === '/application.html'){
		res.writeHead(200, {"Content-Type": "text/html"});
		fs.readFile('./View/application.html', 'utf8', function(err, contents) {
			res.end(contents);
		});
	}
	else if(pathName === '/Application.js'){
		var Application = require("./Model/Application.js");
		
		if(reqData.action && reqData.action == "registerApplication" ) {
			Application.registerApplication(res, reqData);
		}
		else if(reqData.action && reqData.action == "browseApplication" ) {
			Application.browseApplication(res, reqData);
		}
		else if(reqData.action && reqData.action == "getApplicationNames" ) {
			Application.getApplicationNames(res, reqData);
		}
		else if(reqData.action && reqData.action == "getInstalledDeviceNames" ) {
			Application.getInstalledDeviceNames(res, reqData);
		}
		else if(reqData.action && reqData.action == "getInstalledApplicationNames" ) {
			Application.getInstalledApplicationNames(res, reqData);
		}
		else if(reqData.action && reqData.action == "installApplication" ) {
			Application.installApplication(res, reqData);
		}
		else if(reqData.action && reqData.action == "IncrementCounterByOne" ) {
			Application.IncrementCounterByOne(res, reqData);
		}
		else {
			console.log("ERROR: APPLICATION Action Not Defined");
		}
	}
	
	//Style Paths
	else if(pathName === '/style.css'){
		res.writeHead(200, {"Content-Type": "text/css"});
		fs.readFile('./Style/style.css', 'utf8', function(err, contents) {
				res.end(contents);
		});
	}
	
	//Controller Paths
	//else if(pathName === 'maincontroller.js'){
	
	else if(pathName === '/mainController.js'){
		res.writeHead(200, { 'Content-Type': 'text/javascript' });
		fs.readFile('./Controller/mainController.js', 'utf8', function(err, contents) {	
			res.end(contents);
		});
	}
	
	//Images
	else if (pathName == '/del.png') {
		var img = fs.readFileSync('./Images/del.png');
	     res.writeHead(200, {'Content-Type': 'image/gif' });
	     res.end(img, 'binary');
	}
	
	//Default Path
	else{
		if(pathName !=""){
			res.writeHead(404, {"Content-Type": "text/html"});
			fs.readFile('.'+pathName, 'utf8', function(err, contents) {
				res.end(contents);
			});
		}
	}
}
console.log("Server Running...");
































































