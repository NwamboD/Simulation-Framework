//id, deviceName, deviceToken, networkId

async = require("async");
var databaseConnection = require("../Script/mysql_setup.js");

exports.getExistingDevicesTable = function(res) {

	conn = databaseConnection.getConnectionObject();
	
	var queryString = "SELECT * from device";
	var table = "<table><tr><th>#</th><th>Device Id</th><th>Device Name</th><th>Device Type</th><th>Device Memory</th></tr>";
		
	conn.query('Select * from device', function(error, results,fields){
		if(error)
			throw error;
		else {
			for (var i in results) {
		        var deviceId = results[i]['id'];
		        var deviceName = results[i]['deviceName'];
				table += "<tr>";
				table += "<td><input class='device-checkbox' type='checkbox' id='device-list' value='"+deviceId+"'>"+"</td>";
				table += "<td>"+deviceId+"</td>";
				table += "<td>"+results[i]['deviceName']+"</td>";
				table += "<td>"+results[i]['deviceType']+"</td>";
				table += "<td>"+results[i]['deviceMemory']+"</td>";
				table += "</tr>";
		    }
			
			table += "</table>";
			
			// here send back data 
			res.end(table);
		}
	});
}

exports.addDevice = function(res, formdata){
	
	conn = databaseConnection.getConnectionObject();	
	
	var networkName = formdata['networkname'];
	var deviceName = formdata['devicename'];
	var deviceType = formdata['devicetype'];
	var deviceMemory = formdata['devicememory'];
	
	var nameChecker = false;
	
	var sql = [];
	sql[0] = "Select * from device where deviceName= '" + deviceName + "'";
	
	var addNewDevice = function (sql, doneCallback, test) {

		conn.query(sql, function(error, results,fields){
			if(error)
				throw error;
			else {
				
				for (var i in results) {
					if(results[i]['deviceName'] == deviceName){
						nameChecker = true;
						break;
					}
			    }
				if(nameChecker ==false){
					
					var device = {
							deviceName: deviceName,
							deviceType: deviceType,
							deviceMemory: deviceMemory
					};
					
					var queryString = 'INSERT INTO device set ?';
					
					var result = databaseConnection.insertRecord(queryString, device);
					if (result != false){
						console.log("New: "+ deviceName + " Device Added!");
					}
				}else{
					console.log("Device Name Already Exist");
				}
				return doneCallback(null);
			}
		});
	};

	async.each(sql, addNewDevice, function (err) {
		
		sql = "Select * from device where deviceName= '" + deviceName + "'";
		var deviceId; 
		
		conn.query(sql, function(error, results,fields){
			if(error)
				throw error;
			else {
				for (var i in results) {
					deviceId = results[i]['id'];
			    }
				var networkdevices = {
						deviceId: deviceId,
						networkName: networkName,	
				};
				
				var queryString = 'INSERT INTO networkdevices set ?';
				var result = databaseConnection.insertRecord(queryString, networkdevices);
				console.log(deviceId+ " joined " + networkName + " Network")
			}
		});
	});
	
	
	
	/*var sql = "Select * from device where deviceName= '" + deviceName + "'";
	
	conn.query(sql, function(error, results,fields){
		if(error)
			throw error;
		else {
			for (var i in results) {
				if(results[i]['deviceName'] == deviceName){
					nameChecker = true;
					break;
				}
		    }
			if(nameChecker ==false){
				var device = {
						deviceName: deviceName,
						deviceType: deviceType,
						deviceMemory: deviceMemory
				};
				
				var queryString = 'INSERT INTO device set ?';
				
				var result = databaseConnection.insertRecord(queryString, device);
				if (result != false){
					console.log("New: "+ deviceName + " Device Added!");
				}
			
			}else{
				console.log("Device Name Already Exist");
			}
		}
	});
	
	var network = {
			deviceName: deviceName,
			deviceType: deviceType,
			deviceMemory: deviceMemory
	};
	
	var queryString = 'INSERT INTO Device set ?';
	var result = databaseConnection.insertRecord(queryString, network);
	if (result != false){
		console.log("New: "+ deviceName + " Device Added!");
	}
	*/
}


exports.removeDevice = function(res, formdata){
	
	conn = databaseConnection.getConnectionObject();

	var deviceIds = formdata['deviceIds']; //All device id to be removed
	
	//First check to see if any of the devices are connected to networks
	var deviceIdChecker = function (deviceId, doneCallback, test) {
		var sql = "SELECT * from networkdevices where deviceId='" + deviceId + "'";
		conn.query(sql, function(error, results,fields){
			if(error)
				throw error;
			else {
				//They are not connected
				if(results == ""){
					return doneCallback(null);
					
				}else{
					res.end("Unjoin Device from all Networks to Proceed");
					//console.log("ID exist Sorry. Disconnect device from all Networks before removing the device");
				}
			}
		});
	};
	
	//For each of the device passed as an array, we call the deleteDevice function on each one and when we are done we call the doneCallback
	async.each(deviceIds, deviceIdChecker, function (err) {
		
		var deviceIds = formdata['deviceIds']; //All device id to be removed
		
		var deleteDevice = function (id, doneCallback, test) {
			var sql = "Delete from device where id='" + id + "'";
			conn.query(sql, function(error, results,fields){
				if(error)
					throw error;
				else {
					return doneCallback(null);
				}
			});
		};
		
		//For each of the device passed as an array, we call the deleteDevice function on each one and when we are done we call the doneCallback
		async.each(deviceIds, deleteDevice, function (err) {
			res.end("Devices successfully Removed");
		});
		
	});
}

exports.getDeviceNames = function(res, formdata){
	
	conn = databaseConnection.getConnectionObject();
	
	var sql = formdata['query']; //All device id to be removed
	var combobox = "<select id='device-name'>";

	var buildDeviceComboBox = function (sql, doneCallback, test) {

		var sql = "Select * from device";
		conn.query(sql, function(error, results,fields){
			if(error)
				throw error;
			else {
				
				for (var i in results) {
					var deviceId = results[i]['id'];
			        var deviceName = results[i]['deviceName']; 
			        combobox += "<option value='"+ deviceName +"'>"+ deviceName +"</option>";
			        //combobox += "<input type='hidden' id='myhiddenDeviceId' value='"+ deviceId +"'></option>";
			    }
				return doneCallback(null);
			}
		});
	};
	//http://javascriptplayground.com/blog/2013/06/think-async/
	async.each(sql, buildDeviceComboBox, function (err) {
		combobox += "</select>";
		res.end(combobox);
	});
}

exports.getNetworkNames = function(res, formdata){
	
	conn = databaseConnection.getConnectionObject();
	
	//res.end("Correct Function");
	var sql = formdata['query']; //All device id to be removed
	var combobox = "<select id='join-name'>";

	var buildTable = function (sql, doneCallback, test) {
		  //console.log(id * id);
		var networkCategory = "single";
		var sql = "Select * from network where networkCategory= '" + networkCategory + "'";
		conn.query(sql, function(error, results,fields){
			if(error)
				throw error;
			else {
				for (var i in results) {
					var networkId = results[i]['id'];
			        var networkName = results[i]['networkName']; 
			        combobox += "<option value='"+ networkName +"'>"+ networkName +"</option>";
			    }
				return doneCallback(null);
			}
		});
	};
	//http://javascriptplayground.com/blog/2013/06/think-async/
	async.each(sql, buildTable, function (err) {
		combobox += "</select>";
		res.end(combobox);
	});
}

exports.joinNetwork = function(res, formdata){
	
	conn = databaseConnection.getConnectionObject();

	var deviceIds = formdata['deviceIds']; //All device id to be removed
	var networkName = formdata['networkName'];
	var idExist = false;

	var joinDeviceToNetwork = function (id, doneCallback, test) {
		var counter=0;
		var sql = "SELECT * FROM networkdevices where deviceId='" + id + "'";
		conn.query(sql, function(error, results,fields){
			if(error)
				throw error;
			else {
				for (var i in results) {
					
					if(id == results[i]['deviceId'] && networkName==results[i]['networkName']){
						idExist = true;
					}
			    }

				if(idExist == false){
					//Insert into combined network table
    				var networkdevices = {
    						deviceId: id,
							networkName: networkName,	
					};
    				
    				var queryString = 'INSERT INTO networkdevices set ?';
					var result = databaseConnection.insertRecord(queryString, networkdevices);
					console.log(id+ " joined " + networkName + " Network")
				}else{
					console.log("Device Already Joined the Network");
				}
				return doneCallback(null);
			}
		});
	};
	//http://javascriptplayground.com/blog/2013/06/think-async/
	async.each(deviceIds, joinDeviceToNetwork, function (err) {
		res.end();
	});
}
















