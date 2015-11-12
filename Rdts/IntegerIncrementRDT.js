
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

integerIncrementRDTObject = new IntegerIncrementRDT();
console.log(integerIncrementRDTObject.getCounter());

module.exports = IntegerIncrementRDT;
