
function User(){
	this.name = "";
	this.life = 100;
	this.giveLife = function giveLife(targetPlayer){
		targetPlayer.life +=1;
		console.log(this.name + "gave 1 life to :"+ targetPlayer.name);
	}
}

var Darlington = new User();
var Naveen = new User();

Darlington.name = "Darlington";
Naveen.name = "Naveen";

Darlington.giveLife(Naveen);
console.log("Darlington: "+ Darlington.life);
console.log("Naveen: "+ Naveen.life);

//Using Prototype to add functions to your class/object

User.prototype.uppercut = function uppercut(targetPlayer){
	targetPlayer.life -=3;
	console.log(this.name + "just uppercutted "+ targetPlayer.name);
}

Naveen.uppercut(Darlington);




