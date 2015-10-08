
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

//Step-3 - Test Connection
var queryString = "Select * from user";

conn.query(queryString, function(error, results){
	if(error)
		throw error;
	else {
		console.log(results);
	}
})

conn.end();
