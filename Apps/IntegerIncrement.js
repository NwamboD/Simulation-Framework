
function IntegerIncrement(IntegerIncrement){
	
	//integerIncrementRDTObject = new IntegerIncrementRDT();
	
	//properties/fields
	//this.localCounter = IntegerIncrement.localCounter;
	
	if(IntegerIncrement.localCounter == undefined){
		this.localCounter = 0;
	} else{
		this.localCounter = IntegerIncrement.localCounter;
	}
	
	this.RDT = [
               {
               	name: 'IntegerIncrementRDT',
               	description: 'The IntegerIncrement RDT returns summation of local counter for all devices'
               }
               	
          ];
}

IntegerIncrement.prototype.getApplicationDescription = function (){
	var description = "This is a simple application that returns the local counter value based on the number of increments";
		description += "and a global counter value shared among devices on connected Networks";
	
	return description;
}

IntegerIncrement.prototype.getRDTs = function() {
	
	return this.RDT;
	//return "This Application uses the IntegerIncrement Replicated Data Type";
};

IntegerIncrement.prototype.addOne = function (){
	this.localCounter++;
}

IntegerIncrement.prototype.getLocalCounter = function (){
	return this.localCounter;
}

IntegerIncrement.prototype.getGlobalCounter = function (){	
}

IntegerIncrement.prototype.getArrayOfJSONFunctionObjects = function (){
	
	//var array_of_functions = ["getApplicationDescription", "getRDT", "addOne", "getLocalCounter", "getGlobalCounter"];
	var array_of_function_objects = [
   		{
   			signature: 'getApplicationDescription()',
   			description: 'This method returns the description of the application'
   		},
   		
   		{
   			signature: 'getRDTInfo()',
   			//description: 'This method returns the information of the RDTs that the application uses'
   			description: RDT
   		},
   		{
   			signature: 'addOne()',
   			description: 'This method increments the value of local counter by one'
   		},
   		{
   			signature: 'getLocalCounter()',
   			description: 'This method returns the value of local counter of a device'
   		},
   		{
   			signature: 'getGlobalCounter()',
   			description: 'This method returns the global counter value of all devices connected in a network'
   		}
	];
	
	
	return array_of_function_objects;
}

IntegerIncrement.prototype.getExecutableApplicationMethods = function (){
	
	var array_of_functions = [
		                          IntegerIncrement.prototype.getApplicationDescription,
		                          IntegerIncrement.prototype.getRDTInfo,
		                          IntegerIncrement.prototype.addOne,
		                          IntegerIncrement.prototype.getLocalCounter,
		                          IntegerIncrement.prototype.getGlobalCounter
	                          ];
	
	return array_of_functions;
}

//var IC = new IntegerIncrement();
//IC.addOne();
//console.log("Local Counter is "+ IC.getLocalCounter());
module.exports = IntegerIncrement;
