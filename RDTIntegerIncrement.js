
function RDTIntegerIncrement(){
	
	//properties/fields
	this.counter = 0;
}

IntegerIncrement.prototype.incrementCounter = function (){
	this.counter++;
}

IntegerIncrement.prototype.getCounter = function (){
	return this.counter;
}

module.exports = RDTIntegerIncrement;
