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

	var simulationDuration = formdata['simulationDuration'];
	var simulationDurationUnit = formdata['simulationDurationUnit'];
	
	if (simulationDurationUnit == "Seconds"){	time = parseInt(simulationDuration); } 
	
	else if (simulationDurationUnit == "Minutes"){	time =  parseInt(simulationDuration * 60);} 
	
	else if (simulationDurationUnit == "Hours"){	time =  parseInt(simulationDuration * 60 * 60);} 
	
	else if (simulationDurationUnit == "Days"){		time =  parseInt(simulationDuration * 60 * 60 * 24);} 
	

	var NanoTimer = require('nanotimer');
	 
	var count = time;
	 
	 
	function main(){
	    var timer = new NanoTimer();
	 
	    timer.setInterval(countDown, '', '1s');
	    timer.setTimeout(liftOff, [timer], ''+count+'s');

	}
	 
	function countDown(){
	    console.log('T - ' + count);
	    count--;
	}
	 
	function liftOff(timer){
	    timer.clearInterval();
	    console.log("Simulation Time has ELAPSED");
	    res.end("Simulation Time has ELAPSED")
	}
	 
	main();
		
		

}















