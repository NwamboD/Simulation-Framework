var url = require("url");
async = require("async");
var databaseConnection = require("../Script/mysql_setup.js");

//This Application uses the IntegerIncrement Replicated Data Type
//http://localhost:8000/IntegerIncrement.js
//What form would the application be provided in
/*
 	1. The Application name must be the same as the name of the file
 	2. The Application must have a default constructor that instantiates an object that would be reference to a device
 	3. The Application must have a method getApplicationDescription() that describe what the Application does
 	4. Every method in the application must have a get_methodName_Description. Where method name is replaced with the name of the method
 	5. The Application must have a getRDT method which describes which Replicated Data Type can be used by the Application
 
 	#4 needs to be looked at
 */
exports.registerApplication = function(res, formdata) {
	
	var queryString = "SELECT * from device";
	var mysql = require('mysql');
	var conn = mysql.createConnection({
		host     : "localhost",
		user     : "root",
		password : "",
		database : "SimulationFramework",
		port     : 3306
	});
		
	conn.connect();	
	
	var fs = require('fs');
	
	var applicationName = formdata['applicationName'];
	var applicationDescription = formdata['applicationDescription'];
	var applicationURL = formdata['applicationURL'];	
	var fileContent ="";
	
	var pathName = url.parse(applicationURL).pathname;

	//For external web page
	fs.readFile(applicationURL, 'utf8', function(err, contents) {
	
	//console.log("Application URL "+)
	//fs.readFile('.'+pathName, 'utf8', function(err, contents) {
		fileContent = contents;
		console.log("Came in "+fileContent);
		
		fs.writeFile("./Apps"+pathName, fileContent,function(err) {
		    if(err) {
		        return console.log(err);
		    }
		    console.log("The file was saved!");
		}); 
	});
	
	res.end(applicationURL);
}