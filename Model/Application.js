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
 	5. The Application must have a getRDT method which describes which Replicated Data Type can be used by the Application
 	6. The Application must have a getArrayOfJSONFunctionObjects method which returns an array of function objects of the Application methods
 	7. The Application must have a getExecutableApplicationMethods method which returns an array of excutable functions
 	8. The Application must have a run method that returns the result of the application
 
 	// nodemon --ignore 'C:\Users\Darlington\Desktop\Docs\Dissertation\Simulation Framework\Apps' --debug ./server.js

 */

exports.getApplicationNames = function(res, formdata){
	
	conn = databaseConnection.getConnectionObject();
	
	var sql = formdata['query']; //All device id to be removed
	var combobox = "<select id='application-name'>";

	var buildApplicationComboBox = function (sql, doneCallback, test) {

		var sql = "Select * from application";
		conn.query(sql, function(error, results,fields){
			if(error)
				throw error;
			else {
				for (var i in results) {
					var applicationId = results[i]['applicationId'];
			        var applicationName = results[i]['applicationName']; 
			        combobox += "<option id='"+ applicationId +"' value='"+ applicationName +"'>"+ applicationName +"</option>";
			        //combobox += "<input type='hidden' id='myhidden' value='"+ applicationId +"'></option>";
			    }
				return doneCallback(null);
			}
		});
	};
	//http://javascriptplayground.com/blog/2013/06/think-async/
	async.each(sql, buildApplicationComboBox, function (err) {
		combobox += "</select>";
		res.end(combobox);
	});
}


exports.browseApplications = function(res, formdata) {

	conn = databaseConnection.getConnectionObject();
	
	var queryString = "SELECT * from applicationobject";
	
	var table = "<form action=''><table><tr><th>Device Name</th><th>Aplication Name</th></tr>";
		
	conn.query(queryString, function(error, results,fields){
		if(error)
			throw error;
		else {
			for (var i in results) {
		        var deviceName = results[i]['deviceName'];
		        var applicationName = results[i]['applicationName'];
				table += "<tr>";
				table += "<td>"+deviceName+"</td>";
				table += "<td>"+ applicationName +"</td>";

				/*
				var sql2 = "Select * from applicationsignaturedescription where applicationName='" + applicationName + "'";
				conn.query(sql2, function(error, results2,fields){
					if(error)
						throw error;
					else {
						for (var j in results2) {

							var applicationSignature = results2[j]['applicationSignature']; 
					        var applicationDescription = results2[j]['applicationDescription']; 
					        console.log(applicationSignature);
					        table += "<td>"+ applicationSignature +"</td>";
					       
					    }
					}
				});
				*/
				
				table += "<td><input type=submit value='Run' id='run'></td>";
				//table += "<td><button id='"+ deviceName + "'>Run</button></td>";
				table += "</tr>";
		    }
		
			table += "</table></form>";
			
			res.end(table);
		}
	});
	
}



exports.browseApplication = function(res, formdata) {

	conn = databaseConnection.getConnectionObject();
	
	//var sql2 = "Select * from applicationsignaturedescription where applicationName='" + applicationName + "'";
	var queryString = "SELECT * from applicationsignaturedescription";
	
	var table = "<table width='100%'><tr><th>Application Name</th><th>Application Signature</th><th>Signature Description</th></tr>";
	table +="<col style='width:20%'>";
	table +="<col style='width:30%'>";
	table +="<col style='width:50%'>";
	
	var counter=0;
	conn.query(queryString, function(error, results,fields){
		if(error)
			throw error;
		else {
			for (var i in results) {
				var applicationName = results[i]['applicationName']; 
				var applicationSignature = results[i]['applicationSignature']; 
		        var applicationSignatureDescription = results[i]['applicationSignatureDescription']; 
				table += "<tr>";
				table += "<td>"+applicationName+"</td>";
				
				table += "<td>"+applicationSignature+"</td>";
				
				table += "<td>"+ applicationSignatureDescription['description'] +"</td>";

				table += "</tr>";
				
				counter++;
		    }
		
			table += "</table>";
			
			res.end(table);
		}
	});
	
}



exports.registerApplication = function(res, formdata) {
	
	
	conn = databaseConnection.getConnectionObject();
	
	var fs = require('fs');
	var queryString = "SELECT * from device";
	
	var applicationName = formdata['applicationName'];
	var applicationDescription = formdata['applicationDescription'];
	var applicationURL = "";
	applicationURL = formdata['applicationURL'];	
	var fileContent ="";
	
	var pathname = url.parse(applicationURL).host;
	
	var pathName = url.parse(applicationURL).pathname;
	
	//Just declare an array that does nothing so I can save the application after downloading it
	var doNothing = [0];
	
	var idExist = false;
	
	var getFile = function (doNothing, doneCallback, test) {
		
		//localhost
		if(url.parse(applicationURL).host == "localhost:8000"){
			fs.readFile('.'+pathName, 'utf8', function(err, contents) {
				fileContent = contents;
				
				if(fileContent !=""){
					
					var contents = fs.writeFileSync("./Apps"+pathName, fileContent);
					return doneCallback(null);
					fs.writeFile("./Apps"+pathName, fileContent,function(err) {
					    if(err) {
					        return console.log(err);
					    }else {
					    
					    	console.log("The file was Downloaded!");
					    	return doneCallback(null);
					    }
					}); 
					
					
				}
			});
		} 
	};
	
	async.each(doNothing, getFile, function (err) {
		
		//http://localhost:8000/IntegerIncrement.js
	    var slash = pathName.split("/");
	    var dot = slash[1].split(".");
		var applicationName = dot[0]; 
		var application = require("../Apps"+pathName);
		
		var applicationObject = new application();

		var executableMethods = applicationObject.getExecutableApplicationMethods();
			for(var j=0; j<executableMethods.length;j++){
			//console.log(executableMethods[j]());
		}
		
		var functionObjects = applicationObject.getArrayOfJSONFunctionObjects();
			
		//Generate unique id
		var shortid  =require('shortid');
		var applicationId = shortid.generate();
		
	 
	 	var sql = "SELECT * FROM application ";	//where applicationId='" + applicationId + "'";
	 	var sqlQuery = [];
	 	sqlQuery[0] = sql;
		
		sql = sqlQuery[0];
		conn.query(sql, function(error, results,fields){
			if(error)
				throw error;
			else {
				
				for (var i in results) {
					
					if(applicationName==results[i]['applicationName'] || applicationId==results[i]['applicationId']){
						idExist = true;
					}
			    }
		
				if(idExist == false){

					var application = {
							applicationId: applicationId,
							applicationName: applicationName,
							applicationDescription: applicationDescription,
							applicationURL: applicationURL
					};
					
					var queryString = 'INSERT INTO application set ?';
					var result = databaseConnection.insertRecord(queryString, application);
					
					
					
					var functionObjects = applicationObject.getArrayOfJSONFunctionObjects();

					for(var i=0; i<functionObjects.length;i++){ //functionObjects.length
						
						var applicationSignatureDescription = {
	    						applicationId: applicationId,
	    						applicationName: applicationName,
								applicationSignature: functionObjects[i]['signature'],
								applicationSignatureDescription: functionObjects[i]['description']
						};
						
						var queryString = 'INSERT INTO applicationSignatureDescription set ?';
						var result = databaseConnection.insertRecord(queryString, applicationSignatureDescription);

					}
					console.log(applicationName +" Registered");
				}else{
					console.log("Application Already Registered");
				}
			}
			
		});
		
		
	});
	res.end("New Application Registered");
}


exports.installApplication = function(res, formdata) {

	
	var deviceName = formdata['devicename'];
	//var applicationId = formdata['applicationId'];
	var applicationName = formdata['applicationName'];
	
	var application = require("../Apps/"+applicationName+'.js');
	
	var applicationObject = new application();
	
	//console.log("APP ID IS " + applicationId);
	//var functionObjects = applicationObject.getArrayOfJSONFunctionObjects();
	//for(var i=0; i<functionObjects.length;i++){ //functionObjects.length
		//console.log(functionObjects[i]['signature']);
		//console.log(functionObjects[i]['description']);
	//}
	
	var runResult = applicationObject.run();

	
	var myObjectSerialized = JSON.stringify(runResult);
	
	
	var applicationObject = {
			deviceName: deviceName,
			applicationName: applicationName,
			applicationObject: myObjectSerialized
	};
	
	var queryString = 'INSERT INTO applicationObject set ?';
	var result = databaseConnection.insertRecord(queryString, applicationObject);

	//console.log("INSTALLING APPLICATION "+ runResult);
	
	
	//var myObjectSerialized = JSON.parse(runResult);
	
	//console.log("RETRIEVING APPLICATION "+ runResult);
	//console.log("FINISHED");
	res.end(deviceName +"  :installed "+ applicationName + ":  Application");
	
	
}




















