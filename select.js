
//Step-1 - Import mysql module
var mysql = require('mysql');

//Step-2 - Create mysql connection
var conn = mysql.createConnection({
	
	host     : "localhost",
	user     : "root",
	password : "",
	database : "SimulationFramework",
	port     : 3306
	
});

conn.connect();	

	conn.query('Select networkName from network', function(error, results,fields){
		if(error)
			throw error;
		else {
			console.log("The list of Networks are: "+ fields );
			for (var i in results) {
		        console.log('Network Names: ', results[i].networkName);
		    }
			//return results;
		}
		//return false;
	})
