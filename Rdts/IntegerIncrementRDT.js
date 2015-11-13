
function IntegerIncrementRDT(IntegerIncrementRDT){
	
	//properties/fields
	this.counter = 0;
	if(IntegerIncrementRDT.counter == undefined){
		this.counter = 0;
	} else{
		this.counter = IntegerIncrementRDT.counter;
	}
	
}

IntegerIncrementRDT.prototype.incrementCounter = function (){
	this.counter++;
}

IntegerIncrementRDT.prototype.getCounter = function (){
	return this.counter;
}

//integerIncrementRDTObject = new IntegerIncrementRDT();
//console.log(integerIncrementRDTObject.getCounter());

module.exports = IntegerIncrementRDT;
