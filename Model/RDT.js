var url = require("url");
async = require("async");
var databaseConnection = require("../Script/mysql_setup.js");

//This Application uses the IntegerIncrement Replicated Data Type
//http://localhost:8000/IntegerIncrement.js
//What form would the application be provided in
/*
 	1. The RDT name must be the same as the name of the file
 	2. The RDT must have a default constructor that instantiates an object that would be reference to a device
 	3. The RDT must have a method getApplicationDescription() that describe what the Application does
 	5. The RDT must have a getRDT method which describes which Replicated Data Type can be used by the Application
 	6. The RDT must have a getArrayOfJSONFunctionObjects method which returns an array of function objects of the Application methods
 	7. The RDT must have a getExecutableApplicationMethods method which returns an array of excutable functions
 
 	// nodemon --ignore 'C:\Users\Darlington\Desktop\Docs\Dissertation\Simulation Framework\Rdts' --debug ./server.js

 */

exports.registerRDT = function(res, formdata) {

	conn = databaseConnection.getConnectionObject();
	
	var fs = require('fs');
	//var queryString = "SELECT * from device";
	
	var RDTName = formdata['RDTName'];
	var RDTDescription = formdata['RDTDescription'];
	var RDTURL = "";
	RDTURL = formdata['RDTURL'];	
	var fileContent ="";
	var loopChecker = '';
	
	var pathname = url.parse(RDTURL).host;
	
	var pathName = url.parse(RDTURL).pathname;
	
	//Just declare an array that does nothing so I can save the application after downloading it
	var doNothing = [0];
	
	var idExist = false;
	
	var getFile = function (doNothing, doneCallback, test) {

		//localhost
		if(url.parse(RDTURL).host == "localhost:8000"){
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
			  var request = require("http").get(RDTURL, function(res) {
			
			    res.on('data', function(chunk) {
			      data += chunk;
			    });
			
			    res.on('end', function() {
			    	var pathName = url.parse(RDTURL).pathname;
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
	
	
	async.each(doNothing, getFile, function (err) {
		
		/*
		var pathName = url.parse(RDTURL).pathname;
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
						loopChecker = true;
						res.end(applicationName +":  Application Registered");
						console.log(applicationName +" Registered");
						
					}else{
						console.log("Application Already Registered");
					}
				}
				
			});
		} catch(e) {
		    //process.exit(e.code);
			//http://localhost:8000/add-content.js

			var appName = String(dot);
			appName = appName.replace(",", ".");

			var filePath = 'C:\\Users\\Darlington\\Desktop\\Docs\\Dissertation\\Simulation Framework\\Rdts\\';
			//var filePath = '/users/labnet5/gr2/dn7241/Desktop/Dissertation/Apps/';
			
			fs.unlink(filePath+appName, function (err) {
				  if (err) throw err;
				  console.log('successfully deleted');
			});
			
			loopChecker = false;
			res.end("RDT is NOT provided in the required form");
			
		}
		*/
	});
	
	//if(loopChecker ==true){
	//	res.end(RDTName +":  RDT Registered");
	//}
	
}


exports.getRDTNames = function(res, formdata){
	
	conn = databaseConnection.getConnectionObject();
	
	var sql = formdata['query']; //All device id to be removed
	var combobox = "<select id='rdt-name'>";

	var buildRDTComboBox = function (sql, doneCallback, test) {

		var sql = "Select * from RDT";
		conn.query(sql, function(error, results,fields){
			if(error)
				throw error;
			else {
				for (var i in results) {
					var RDTId = results[i]['RDTId'];
			        var RDTName = results[i]['RDTName']; 
			        combobox += "<option id='"+ RDTId +"' value='"+ RDTName +"'>"+ RDTName +"</option>";
			        //combobox += "<input type='hidden' id='myhidden' value='"+ applicationId +"'></option>";
			    }
				return doneCallback(null);
			}
		});
	};
	async.each(sql, buildRDTComboBox, function (err) {
		combobox += "</select>";
		res.end(combobox);
	});
}

exports.browseApplication = function(res, formdata) {

	conn = databaseConnection.getConnectionObject();
	
	var queryString = "SELECT * from rdtsignaturedescription";
	
	var table = "<table width='100%'><tr><th>RDT Name</th><th>RDT Signature</th><th>RDT Description</th></tr>";
	table +="<col style='width:20%'>";
	table +="<col style='width:30%'>";
	table +="<col style='width:50%'>";
	
	var counter=0;
	conn.query(queryString, function(error, results,fields){
		if(error)
			throw error;
		else {
			for (var i in results) {
				var RDTName = results[i]['RDTName']; 
				var RDTSignature = results[i]['RDTSignature']; 
		        var RDTSignatureDescription = results[i]['RDTSignatureDescription']; 
				table += "<tr>";
				table += "<td>"+RDTName+"</td>";
				
				table += "<td>"+RDTSignature+"</td>";
				
				table += "<td>"+ RDTSignatureDescription +"</td>";

				table += "</tr>";
				
				counter++;
		    }
		
			table += "</table>";
			
			res.end(table);
		}
	});
	
}
