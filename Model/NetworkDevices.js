//id, deviceName, deviceToken, networkId

async = require("async");
var databaseConnection = require("../Script/mysql_setup.js");

exports.getExistingNetworkDevicesTable = function(res) {
	
	conn = databaseConnection.getConnectionObject();
	
	var queryString = "SELECT * from networkdevices";
	
	var table = "<table><tr><th>Device Id</th><th>Network Name</th></tr>";
		
	conn.query(queryString, function(error, results,fields){
		if(error)
			throw error;
		else {
			for (var i in results) {
		        var deviceId = results[i]['deviceId'];
		        var networkName = results[i]['networkName'];
				table += "<tr>";
				table += "<td>"+deviceId+"</td>";
				table += "<td>"+ networkName +"</td>";
				table += "</tr>";
		    }
			
			table += "</table>";
			
			res.end(table);
		}
	});
}


exports.getConnectedNetworkNames = function(res,formdata) {

	conn = databaseConnection.getConnectionObject();

	var deviceId = formdata['deviceIds'];
	
	var table = "<table><tr><th>#</th><th>Network Id</th><th></th><th>Network name</th></tr>";
	
	var buildTable = function (id, doneCallback, test) {
		 
		var sql = "Select * from networkdevices where deviceId='" + id + "'";
		conn.query(sql, function(error, results,fields){
			if(error)
				throw error;
			else {
				for (var i in results) {

					var networkId = results[i]['id'];
			        var networkName = results[i]['networkName']; 
			        table += "<input type='hidden' id='unjoinnetwork-name' value='"+ networkName +"'>";
			        table += "<tr>";
					//table += "<td><input class='network-checkbox' type='checkbox' id='deletenetwork-list' value='"+networkId+"'>"+"</td>";
			        table += "<td><input class='network-checkbox' type='checkbox' id='deletenetwork-list' value='"+networkId+"'>"+"</td>";
					table += "<td>"+networkId+"</td>";
					table += "<td></td>";
					table += "<td>"+results[i]['networkName']+"</td>";
					table += "<td></td>";
					table += "</tr>";
			    }
				return doneCallback(null);
			}
		});
	};
	//http://javascriptplayground.com/blog/2013/06/think-async/
	async.each(deviceId, buildTable, function (err) {
		table += "</table>";
		res.end(table);
	});

}



exports.removeDeviceFromNetwork = function(res,formdata) {

	conn = databaseConnection.getConnectionObject();

	var networkId = formdata['networkIds'];
	var deviceId = formdata['deviceId'];
	
	var networksToDelete = function (id, doneCallback, test) {
		var queryString = "DELETE FROM networkdevices where id= '" + id + "'";
		conn.query(queryString, function(error, results,fields){
			if(error)
				throw error;
			else{
				var result = databaseConnection.queryDatabase(queryString);
			}
			return doneCallback(null);
		});
	};

	async.each(networkId, networksToDelete, function (err) {
		
		var table = "<table><tr><th>#</th><th>Network Id</th><th></th><th>Network name</th></tr>";
			 
		var sql = "Select * from networkdevices where deviceId='" + deviceId + "'";
		conn.query(sql, function(error, results,fields){
			if(error)
				throw error;
			else {
				for (var i in results) {

					var networkId = results[i]['id'];
			        var networkName = results[i]['networkName']; 
			        table += "<input type='hidden' id='unjoinnetwork-name' value='"+ networkName +"'>";
			        table += "<tr>";
			        table += "<td><input class='network-checkbox' type='checkbox' id='deletenetwork-list' value='"+networkId+"'>"+"</td>";
					table += "<td>"+networkId+"</td>";
					table += "<td></td>";
					table += "<td>"+results[i]['networkName']+"</td>";
					table += "<td></td>";
					table += "</tr>";
			    }
			}
			table += "</table>";
			res.end(table);
		});
		
		

	});
}