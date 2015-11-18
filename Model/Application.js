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
 
 	// nodemon --ignore 'C:\Users\Darlington\Desktop\Docs\Dissertation\Simulation Framework\Apps' --debug ./server.js
 	//http://localhost:8000/IntegerIncrement.js

 */




exports.registerApplication = function(res, formdata) {
	
	
	conn = databaseConnection.getConnectionObject();
	
	var fs = require('fs');
	var queryString = "SELECT * from device";
	
	var applicationName = formdata['applicationName'];
	var applicationDescription = formdata['applicationDescription'];
	var applicationURL = "";
	applicationURL = formdata['applicationURL'];	
	var fileContent ="";
	var loopChecker = '';
	
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
					//return doneCallback(null);
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
		//external url
		else{
			
			var data = "";
			  var request = require("http").get(applicationURL, function(res) {
			
			    res.on('data', function(chunk) {
			      data += chunk;
			    });
			
			    res.on('end', function() {
			    	var pathName = url.parse(applicationURL).pathname;
			    	var findLastSlash = 0;
			    	var pname = pathName;
			    	
			    	var pathLength = pname.length;
			    	//console.log("Length is "+pname.length)
			    	for(var i=0; i<pathLength;i++){
			    		if(pname[i] == '/'){
			    			findLastSlash = i;
			    		}
			    	}
			    
			    	var pathName = pathName.slice(findLastSlash,pathLength);
			    	
			    	//console.log("Final Path :"+pathName);
			    	
			    	fs.writeFile("./Apps"+pathName, data,function(err) {
					    if(err) {
					        return console.log(err);
					    }
					 
					    console.log("The file was Downloaded!"); 
					    
					    return doneCallback(null);
					});
					
			    	 
			    })
			  });

			  request.on('error', function(e) {
			    console.log("Got error: " + e.message);
			  });
		}	
		
	};
	
	//Do this after downloading application from either local server or external server
	async.each(doNothing, getFile, function (err) {
		
		
		var pathName = url.parse(applicationURL).pathname;
    	var findLastSlash = 0;
    	var pname = pathName;
    	
    	//Logic for a js file that might be in several sub directories
    	var pathLength = pname.length;
    	//console.log("Length is "+pname.length)
    	for(var i=0; i<pathLength;i++){
    		if(pname[i] == '/'){
    			findLastSlash = i;
    		}
    	}
    
    	var pathName = pathName.slice(findLastSlash,pathLength);

		//http://localhost:8000/IntegerIncrement.js
    	//http://localhost:8000/add-content.js
	    var slash = pathName.split("/");
	    var dot = slash[1].split(".");
		var applicationName = dot[0]; 
		
		
		
		try {
		    var application = require("../Apps"+pathName);
		  
		    //console.log("Pathname is  "+application);
			var applicationObject = new application(pathName);
			
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
					//check if the application has already been registered
					if(idExist == false){
	
						var application = {
								applicationId: applicationId,
								applicationName: applicationName,
								applicationDescription: applicationDescription,
								applicationURL: applicationURL
						};
						
						var queryString = 'INSERT INTO application set ?';
						var result = databaseConnection.insertRecord(queryString, application);
						
						//insert record into applicationSignatureDescription (holds all the methods of an application)
						var functionObjects = applicationObject.getArrayOfJSONFunctionObjects();
	
						for(var i=0; i<functionObjects.length;i++){ //functionObjects.length
							
							var applicationSignatureDescription = {
		    						applicationId: applicationId,
		    						applicationName: applicationName,
									applicationSignature: functionObjects[i]['signature'],
									//applicationSignatureDescription: functionObjects[i]['description']
									//serializing the object because RDTs are objects
									applicationSignatureDescription: JSON.stringify(functionObjects[i]['description'])
							};
							
							var queryString = 'INSERT INTO applicationSignatureDescription set ?';
							var result = databaseConnection.insertRecord(queryString, applicationSignatureDescription);
	
						}
						loopChecker = true;
						res.end(applicationName +":  Application Registered");
						console.log(applicationName +" Registered");
						
					}else{
						console.log("Application Already Registered");
					}
				}
				
			});
		} catch(e) {
			console.log(e);
			//http://localhost:8000/add-content.js
			//http://localhost:8000/IntegerIncrement.js

			var appName = String(dot);
			appName = appName.replace(",", ".");

			var filePath = 'C:\\Users\\Darlington\\Desktop\\Docs\\Dissertation\\Simulation Framework\\Apps\\';
			//var filePath = '/users/labnet5/gr2/dn7241/Desktop/Dissertation/Apps/';
			
			
			fs.unlink(filePath+appName, function (err) {
				if (err) throw err;
				 console.log('successfully deleted');
			});
			
			loopChecker = false;
			res.end("Application is NOT provided in the required form");
			
			
		}
	});
	
	if(loopChecker ==true){
		res.end(applicationName +":  Application Registered");
	}
	
}


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


exports.getInstalledDeviceNames = function(res, formdata){
	
	conn = databaseConnection.getConnectionObject();
	
	var sql = formdata['query']; //All device id to be removed
	var combobox = "<select id='installeddevice-name'>";

	var buildInstalledDeviceNameComboBox = function (sql, doneCallback, test) {

		var sql = "Select * from applicationobject";
		conn.query(sql, function(error, results,fields){
			if(error)
				throw error;
			else {
				for (var i in results) {
					var applicationId = results[i]['applicationId'];
			        var deviceName = results[i]['deviceName']; 
			        combobox += "<option id='"+ applicationId +"' value='"+ deviceName +"'>"+ deviceName +"</option>";
			        //combobox += "<input type='hidden' id='myhidden' value='"+ applicationId +"'></option>";
			    }
				return doneCallback(null);
			}
		});
	};
	//http://javascriptplayground.com/blog/2013/06/think-async/
	async.each(sql, buildInstalledDeviceNameComboBox, function (err) {
		combobox += "</select>";
		res.end(combobox);
	});
}


exports.getInstalledApplicationNames = function(res, formdata){
	
	conn = databaseConnection.getConnectionObject();
	
	var sql = formdata['query']; //All device id to be removed
	var combobox = "<select id='installedapplication-name'>";

	var arr = [];
	var applicationChecker = false;
	
	var buildInstalledApplicationComboBox = function (sql, doneCallback, test) {

		var sql = "Select * from applicationobject";
		conn.query(sql, function(error, results,fields){
			if(error)
				throw error;
			else {
				
				for (var i in results) {
					var applicationId = results[i]['applicationId'];
			        var applicationName = results[i]['applicationName']; 
			        
			        for (var j=-1;j<arr.length;j++) {
			     
			        	  if(arr[j] != applicationName){
			        		 
			        		  applicationChecker = true;
			        		  arr[j] = applicationName;
			        	  }else{
			        		  applicationChecker = false;
			        		  break;
			        	  }
			        }
			        if(applicationChecker ==true){
			        	 combobox += "<option id='"+ applicationId +"' value='"+ applicationName +"'>"+ applicationName +"</option>";
			        }
			        applicationChecker = false;
			        
			    }
				return doneCallback(null);
			}
		});
	};
	//http://javascriptplayground.com/blog/2013/06/think-async/
	async.each(sql, buildInstalledApplicationComboBox, function (err) {
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
				table += "</tr>";
		    }
		
			table += "</table></form>";
			
			res.end(table);
		}
	});
}

exports.browseApplication = function(res, formdata) {

	conn = databaseConnection.getConnectionObject();
	
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
				
				applicationSignatureDescription = JSON.parse(applicationSignatureDescription);
				
				//If the application signature description is a json object 
				if(typeof applicationSignatureDescription == 'object'){

					for(var i = 0; i<applicationSignatureDescription.length; i++)
					{  
						table += "<td>"+ applicationSignatureDescription[i]['name'] +"</td>";
					}
				}else{
					table += "<td>"+ applicationSignatureDescription +"</td>";
				}
	
				table += "</tr>";
				
				counter++;
		    }
		
			table += "</table>";
			
			res.end(table);
		}
	});
	
}


exports.installApplication = function(res, formdata) {

	var deviceName = formdata['devicename'];
	var applicationName = formdata['applicationName'];
	
	var application = require("../Apps/"+applicationName+'.js');
	
	//pass in application name to reinitialize new object with the properties of the old object
	var applicationObject = new application(applicationName);	
	
	var RDTs = applicationObject.getRDTs();
	
	var functionObjects = applicationObject.getArrayOfJSONFunctionObjects();
	//console.log("Executable Methods are "+ functionObjects);
	
	for(var i=0; i<RDTs.length;i++){
		
		var rdtName = RDTs[i]['name'];

		try{
			//console.log("RDT Name is: "+rdtName);
			var rdt = require("../Rdts/"+rdtName+'.js');
			
			var rdtObject = new rdt(rdtName);
			
			var myApplicationObjectSerialized = JSON.stringify(applicationObject);
			var myRDTObjectSerialized = JSON.stringify(rdtObject);
			
			var mySerializedapplicationExecutableMethods = JSON.stringify(functionObjects);
		
			var applicationObject = {
					deviceName: deviceName,
					applicationName: applicationName,
					applicationExecutableMethods: mySerializedapplicationExecutableMethods,
					applicationObject: myApplicationObjectSerialized,
					rdtObject: myRDTObjectSerialized
			};
			
			var queryString = 'INSERT INTO applicationObject set ?';
			var result = databaseConnection.insertRecord(queryString, applicationObject);
		
			res.end(deviceName +"  :installed "+ applicationName + ":  Application");	
			
		}catch(e) {	
			console.log(e);
			//console.log(rdtName +" Has not yet been registered with the Simulation");
		}
		
	}
	
}


exports.IncrementCounterByOne = function(res, formdata) {

	var installedDeviceName = formdata['installedDeviceName'];
	var installedApplicationName = formdata['installedApplicationName'];
	
	var queryString = "SELECT * from applicationobject where deviceName= '" + installedDeviceName + "' AND applicationName='"+ installedApplicationName + "'";
	
	conn.query(queryString, function(error, results,fields){
		
		if(error)
			throw error;
		else {
			for (var i in results) {
				
				var deviceName = results[i]['deviceName']; 
				var applicationName = results[i]['applicationName']; 
				var applicationObject = results[i]['applicationObject']; 
				var rdtObject = results[i]['rdtObject'];
				
				//console.log("RDT counter here is "+rdtObject);
				applicationObject = JSON.parse(applicationObject);
				rdtObject = JSON.parse(rdtObject);

				if(typeof applicationObject === 'object'){
					
					var rdtName = applicationObject.RDT[i]['name'];
					//console.log("Application Object is "+ rdtName);
					
					var application = require("../Apps/"+applicationName+'.js');
					var newApplicationObject = new application(applicationObject);	//pass the serialized object with properties to the application so it doesn't lose its state
					
					var rdt = require("../Rdts/"+rdtName+'.js');
					var newRdtObject = new rdt(rdtObject);
					
					//console.log(deviceName +" :OLD COUNTER = "+ newApplicationObject.getLocalCounter());
					newApplicationObject.addOne();	//localCounter
					//console.log(deviceName + " New Counter = :"+ newApplicationObject.getLocalCounter());
					//res.end(deviceName + " :New Counter = "+ newApplicationObject.getLocalCounter());
					newApplicationObject = JSON.stringify(newApplicationObject);
					//var queryString = "UPDATE applicationobject SET applicationobject= '" + newApplicationObject + "' where deviceName= '" + deviceName + "'";
					//var result = databaseConnection.queryDatabase(queryString);
					
					console.log(deviceName +" :OLD COUNTER = "+ newRdtObject.getCounter());
					newRdtObject.incrementCounter();	//globalCounter from RDT
					console.log(deviceName + " New Counter = :"+ newRdtObject.getCounter());
					res.end(deviceName + " :New Counter = "+ newRdtObject.getCounter());
					newRdtObject = JSON.stringify(newRdtObject);
					//var queryString = "UPDATE applicationobject SET rdtobject= '" + newRdtObject + "' where deviceName= '" + deviceName + "'";
					
					var queryString = "UPDATE applicationobject SET applicationobject= '" + newApplicationObject + "',rdtobject= '" + newRdtObject + "' where deviceName= '" + deviceName + "'";
					var result = databaseConnection.queryDatabase(queryString);

				}else{
					console.log("NOT AN OBJECT ");
				}
				
		    }
		}
	});
	
}




//SIMULATION SCRIPT
exports.runSimulationScript = function(res, formdata) {

	var deviceName = formdata['devicename'];
	var applicationName = formdata['applicationName'];
	
	var application = require("../Apps/"+applicationName+'.js');
	var applicationObject = new application(applicationName);
	
	var RDTs = applicationObject.getRDTs();
	var rdtName = RDTs[0]['name'];	//Would have to edit this part to handle many RDTs
	var rdt = require("../Rdts/"+rdtName+'.js');
	var rdtObject = new rdt();
	
	//rdtObject.incrementCounter();
	//console.log("RDT Counter is "+rdtObject.getCounter());
	//console.log("RDTs used by the application is "+RDTs[0]['name'])
	
}















