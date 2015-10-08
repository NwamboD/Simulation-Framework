//id, deviceName, deviceToken, networkId

function Device(){
	
	this.deviceName = "";
	this.deviceToken = "";
	this.networkId = 0;
	
	this.createDevice = function createDevice(deviceName) {
		
		this.deviceName = deviceName;
		console.log("New: "+ this.deviceName + " Device Created!");
		
	}
	
	this.addDeviceToNetwork = function addDeviceToNetwork() {
		
	}

	this.removeDeviceFromNetwork = function removeDeviceFromNetwork() {
		
	}
	
}

var Samsung = new Device();
var Iphone = new Device();
var Htc = new Device();
var BlackBerry = new Device();


Samsung.name = "Samsung Galaxy Note 4";

Samsung.createDevice(Samsung.name);