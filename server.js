
//Including the modules
var port = 8000;
var fs = require ("fs");
var url = require("url");
var url = require("url");
var http = require("http");
var connect = require('connect');



//Creating the server
http.createServer(function(req,res){	
	var pathName = url.parse(req.url).pathname;
	routePath(req, res, pathName);
}).listen(port, '127.0.0.1');


//Adding routes to the server
function routePath(req, res, pathName){
	console.log(req);
	
	if(pathName === '/' || pathName === '/index.html'){
		fs.readFile('./index.html', 'utf8', function(err, contents) {
			res.end(contents);
		});	
	}
	
	//Network Paths
	else if(pathName === '/network.html'){
		fs.readFile('./View/network.html', 'utf8', function(err, contents) {
				res.end(contents);
		});
	}
	else if(pathName === '/createNetwork'){
		Network.createNetwork("Wifi");
	}
	else if(pathName === '/Network.js'){
		var Network = require("./Model/Network.js");
		Network.createNetwork("Wifi");
	}
	
	//Device Paths
	else if(pathName === '/device.html'){
		fs.readFile('./View/device.html', 'utf8', function(err, contents) {
			res.end(contents);
		});	
	}
	
	//Log Paths
	else if(pathName === '/log.html'){
		fs.readFile('./View/log.html', 'utf8', function(err, contents) {
			res.end(contents);
		});	
	}
	
	//Style Paths
	else if(pathName === '/style.css'){
		fs.readFile('./Style/style.css', 'utf8', function(err, contents) {
				res.end(contents);
		});
	}
	
	//Controller Paths
	else if(pathName === '/main.js'){
		fs.readFile('./Controller/mainController.js', 'utf8', function(err, contents) {
				res.end(contents);
		});
	}
	
	//Default Path
	else{
		res.writeHead(404, {"Content-Type": "text/plain"});
		res.end("Page Not Found");
	}
}
console.log("Server Running...");
































































