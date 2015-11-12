
function IntegerIncrementRDT(){
	
	//properties/fields
	this.counter = 0;
}

IntegerIncrementRDT.prototype.incrementCounter = function (){
	this.counter++;
}

IntegerIncrementRDT.prototype.getCounter = function (){
	return this.counter;
}

module.exports = IntegerIncrementRDT;
