var exports = module.exports = {}; 

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
exports.openConnection = function(){
	conn.connect();
}

exports.getConnectionObject = function(){
	return conn;
}

exports.queryDatabase = function(queryString){
	
	conn.query(queryString, function(error, results){
		if(error)
			throw error;
		else {
			return results;
		}
		return false;
	})
}

exports.retrieveRecord = function(queryString){
	
	conn.query(queryString, function(error, results){
		if(error)
			throw error;
		else {
			return results;
		}
		return false;
	})
}	

exports.deleteRecord = function(queryString){
	
	conn.query(queryString, function(error, results){
		if(error)
			throw error;
		else {
			return results;
		}
		return false;
	})
}	

exports.insertRecord = function(queryString, tableName){
	
	conn.query(queryString, tableName, function(error, results){
		if(error)
			throw error;
		else {
			//console.log("The list of Networks are: "+ results['networkName'] );
			return results;
		}
		return false;
	})
}	

exports.closeConnection = function(){
	conn.end();
}

	
	
	
	
	
	
	
	
	
	
	
	
	
	
