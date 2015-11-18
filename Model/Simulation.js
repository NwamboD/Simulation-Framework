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

 */

//SIMULATION SCRIPT
exports.runSimulationScript = function(res, formdata) {

	conn = databaseConnection.getConnectionObject();
	
	//convert the user input a a unit of seconds
	var simulationDuration = formdata['simulationDuration'];
	var simulationDurationUnit = formdata['simulationDurationUnit'];
	
	if (simulationDurationUnit == "Seconds"){	time = parseInt(simulationDuration); } 
	
	else if (simulationDurationUnit == "Minutes"){	time =  parseInt(simulationDuration * 60);} 
	
	else if (simulationDurationUnit == "Hours"){	time =  parseInt(simulationDuration * 60 * 60);} 
	
	else if (simulationDurationUnit == "Days"){		time =  parseInt(simulationDuration * 60 * 60 * 24);} 
	
	
	//declare arrays 
	var deviceNameArray = [], deviceNameArrayCounter=0;
	var applicationNameArray = [], applicationNameArrayCounter=0;
	var applicationMethodArray = [], applicationMethodArrayCounter=0;
	var applicationObjectArray = [], applicationObjectArrayCounter=0;
	var rdtObjectArray = [], rdtObjectArrayCounter=0;
	
	var arrayOfObjectsMethods = [];
	var arrayOfObjectsMethodsFinal = [];
	var appNames = [];
	
	var applicationMethods = '';
	
	var application = '';
	var rdt = '';
	
	var arr = [];
	var queryString = "SELECT * from applicationobject";
	arr[0] = queryString;
	
	//get all application installed on devices
	var readyObjectsForSimulation = function (arr, doneCallback, test) {
		
		var queryString = "SELECT * from applicationobject";
		conn.query(queryString, function(error, results,fields){
			if(error)
				throw error;
			else {
				
				for (var i in results) {
					
					var deviceName = results[i]['deviceName']; 
					var applicationName = results[i]['applicationName']; 
					applicationMethods = results[i]['applicationExecutableMethods']; 
					var applicationObject = results[i]['applicationObject']; 
					var rdtObject = results[i]['rdtObject'];
					
					//unserialize the objects
					applicationMethods = JSON.parse(applicationMethods);
					applicationObject = JSON.parse(applicationObject);
					rdtObject = JSON.parse(rdtObject);
					
					if(typeof applicationObject === 'object'){
						
						//console.log("RDT name "+ applicationObject.RDT[0].name);
						var rdtName = applicationObject.RDT[0].name;
						
						//get all the signatures of the application
						for(var i=0; i<applicationMethods.length;i++){ 
							
							applicationMethodArray[i] = applicationMethods[i]['signature'];
							arrayOfObjectsMethods[i]=applicationMethodArray[i];
						}
						
						arrayOfObjectsMethodsFinal[applicationMethodArrayCounter] = arrayOfObjectsMethods;
						//console.log("Application Object Methods: "+ arrayOfObjectsMethods);
						
						//include the files of the applications and rdts
						application = require("../Apps/"+applicationName+'.js');
						rdt = require("../Rdts/"+rdtName+'.js');
					}
					
					//store them in an array so we can randomize
					deviceNameArray[deviceNameArrayCounter] = deviceName; 
					applicationNameArray[applicationNameArrayCounter] = applicationName;
					applicationObjectArray[applicationObjectArrayCounter] = applicationObject;
					rdtObjectArray[rdtObjectArrayCounter] = rdtObject;
					
					//increment their array index
					deviceNameArrayCounter++;
					applicationNameArrayCounter++;
					applicationMethodArrayCounter++;
					applicationObjectArrayCounter++;
					rdtObjectArrayCounter++;
				
				}
				return doneCallback(null);
			}
		});
		
	};
	
	//do this after getting all the information needed
	async.each(arr, readyObjectsForSimulation, function (err) {
		
		var fileName = new Date().getTime();
		var fs = require("fs");

		//create a log file based on current system time to store simulation
		fs.writeFile('./Logs/'+fileName+'.txt', 'Starting Simulation...\n\n', function (err) {
	      if (err) throw err;
	    });
		
		var counter = 0;
		var interval = setInterval( function() {

			counter++;
			if (counter >= time+1) {
		    	clearInterval(interval);
		    }else{
		    	var dbApplicationObject = '';
		    	var dbRdtObject = '';
		    	
		    	//get random application object from array
		    	var item = applicationObjectArray[Math.floor(Math.random()*applicationObjectArray.length)];
		    	var index = applicationObjectArray.indexOf(item);
		    
		    	var arr2 = [];
		    	var queryString2 = "SELECT * from applicationobject where deviceName= '" + deviceNameArray[index] + "' AND applicationName='"+ applicationNameArray[index] + "'";
		    	arr2[0] = queryString2;
		    	
		    	//retrieve information of the randomly generated object
		    	var retrieveObject = function (arr2, doneCallback, test) {
		    		var queryString2 = "SELECT * from applicationobject where deviceName= '" + deviceNameArray[index] + "' AND applicationName='"+ applicationNameArray[index] + "'";
					conn.query(queryString2, function(error, results,fields){
						if(error)
							throw error;
						else {
							for (var i in results) {
								dbApplicationObject = results[i]['applicationObject']; 
								dbRdtObject = results[i]['rdtObject'];
			    		    }
							
							//unserialize database objects
							dbApplicationObject = JSON.parse(dbApplicationObject);
							dbRdtObject = JSON.parse(dbRdtObject); 
							
							return doneCallback(null);
						}
					});
				};
				
				async.each(arr2, retrieveObject, function (err) {
					
					
					var newApplicationObject = new application(dbApplicationObject);	//pass the serialized object with properties to the application so it doesn't lose its state
					var newRdtObject = new rdt(dbRdtObject);
			    	
			    	var selectedIndexLength = arrayOfObjectsMethodsFinal[index].length;	//gives you the length of the number of methods in that index 
			    	
			    	var indexOfRandomFunction = [Math.floor(Math.random() * (selectedIndexLength - 0) + 0)]; //get any random number between 0 and length of the array to execute

			    	var methodItem = arrayOfObjectsMethodsFinal[index][indexOfRandomFunction];	//get a random method at a given index
			    	
			    	var extractedMethod = methodItem.substring(0, methodItem.length-2);	//extract the signature to take out () so you can call it as a function
			    	
			    	//newApplicationObject[extractedMethod]());	//This would call the random method but we are specifically interested in the method addOne for now
			    	var logMessage = "\nDevice <"+deviceNameArray[index] +">  called the method:-  "+ extractedMethod +"()";
			    	
			    	if (extractedMethod =="addOne"){

			    		console.log(logMessage);
			    		fs.appendFile(fileName+'.txt', logMessage + "\n");
			    		
			    		console.log("Old Counter : "+  newApplicationObject["getLocalCounter"]() );
			    		fs.appendFile(fileName+'.txt', "Old Counter is "+  newApplicationObject["getLocalCounter"]() + "\n");
			    		
			    		newApplicationObject[extractedMethod]();
			    		newRdtObject.incrementCounter();
			    			
			    		console.log("New Counter : "+  newApplicationObject["getLocalCounter"]());
			    		fs.appendFile(fileName+'.txt', "New Counter is "+  newApplicationObject["getLocalCounter"]() + "\n");
			    		
			    		
			    		newApplicationObject = JSON.stringify(newApplicationObject);
			    		newRdtObject = JSON.stringify(newRdtObject);
				    	//var queryString = "UPDATE applicationobject SET applicationobject= '" + newApplicationObject + "' where deviceName= '" + deviceNameArray[index] + "'";
			    		var queryString = "UPDATE applicationobject SET applicationobject= '" + newApplicationObject + "',rdtobject= '" + newRdtObject + "' where deviceName= '" + deviceNameArray[index] + "'";
						var result = databaseConnection.queryDatabase(queryString);
					
			    	}else{
			 
			    		console.log(logMessage);
			    		//console.log(newApplicationObject[extractedMethod]());
			    	}
				});
		    }
		}, 1000);
	});
}















