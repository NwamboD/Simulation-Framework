
function FriendFinderRDT(){
	
	//properties/fields
	this.friends = 250;
}

IntegerIncrementRDT.prototype.getFriends = function (){
	return this.friends;
}

module.exports = FriendFinderRDT;