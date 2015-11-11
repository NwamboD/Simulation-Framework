//exports.showNetworks = function(){}
//var exports = module.exports = {};

//id, joinedId, networkName
async = require("async");

var databaseConnection = require("../Script/mysql_setup.js");

exports.createNetwork = function(res, formdata){
	
	var networkName = formdata['networkname'];
	var networkType = formdata['networktype'];
	
	
	var nameChecker = false;
	conn = databaseConnection.getConnectionObject();
	
	var sql = "Select * from network where networkName= '" + networkName + "'";
	
	conn.query(sql, function(error, results,fields){
		if(error)
			throw error;
		else {
			for (var i in results) {
				if(results[i]['networkName'] == networkName){
					nameChecker = true;
					break;
				}
		    }
			if(nameChecker ==false){
				var network = {
						networkName: networkName,
						networkType: networkType
				};
				
				var queryString = 'INSERT INTO network set ?';
				//var queryString = "INSERT INTO Network (id, joinedId, networkName) VALUES ('','', '" + networkName + "')";

				//databaseConnection.openConnection();
				var result = databaseConnection.insertRecord(queryString, network);
				if (result != false){
					console.log("New: "+ networkName + " Network Created!");
				}
				//databaseConnection.closeConnection();
			}else{
				console.log("Network Name Already Exist");
			}
		}
	});
}

exports.getExistingNetworksTable = function(res) {
	
	var queryString = "SELECT * from network";
	conn = databaseConnection.getConnectionObject();
	
	var table = "<table><tr><th>#</th><th>Delete Network</th><th>Network Id</th><th>Network name</th><th>Network Category</th><th>Network Type</th></tr>";

	conn.query('Select * from network', function(error, results,fields){
		if(error)
			throw error;
		else {
			for (var i in results) {
		        var networkId = results[i]['id'];
		        var networkCategory = results[i]['networkCategory'];
		        var networkName = results[i]['networkName'];
		        var networkType = results[i]['networkType'];
				table += "<tr>";
				table += "<td><input class='network-checkbox' type='checkbox' id='network-list' value='"+networkId+"'>"+"</td>";
				
				//Ability to delete single network
				if(networkCategory =="single"){
					table += "<td><img src='del.png' id='delimg' ></td>";
				}else{
					//To maintain the table column
					table += "<td></td>";
				}
				
				table += "<td>"+networkId+"</td>";
				table += "<td>"+results[i]['networkName']+"</td>";
				table += "<td>"+results[i]['networkCategory']+"</td>";
				table += "<td>"+results[i]['networkType']+"</td>";
				table += "</tr>";
		    }
			
			table += "</table>";
			
			// here send back data 
			res.end(table);
		}
	});
}


exports.disconnectNetwork = function(res,formdata) {

	conn = databaseConnection.getConnectionObject();
	
	var id = formdata['networkIds'][0]; //Combined neteworkId
	
	var sql = "Select * from network where id= '" + id + "'";
	var actualIds;
	
	conn.query(sql, function(error, results,fields){
		if(error)
			throw error;
		else {
			var networkName;
			for (var i in results) {
		        networkName = results[i]['networkName'];
		    }
			var temp = networkName.split(":");
			var networkPrefix = temp[0]; //E.g Network:
			var actualIds = temp[1].split("-");
		}
		buildSelectedNetworkTable(networkName, actualIds, res);
	});
}

//exports.buildSelectedNetworkTable = function(actualIds) {
function buildSelectedNetworkTable(networkName, actualIds, res){
	
	conn = databaseConnection.getConnectionObject();
	
	var table = "<table><tr><th>#</th><th>Network Id</th><th></th><th>Network name</th><th></th><th>Network Category</th><th>Network Type</th></tr>";
	
	var counter=0;
	var buildTable = function (id, doneCallback, test) {
		  //console.log(id * id);
		var sql = "Select * from network where id='" + id + "'";
		conn.query(sql, function(error, results,fields){
			if(error)
				throw error;
			else {
				for (var i in results) {
					counter++;
					var networkId = results[i]['id'];
			        var networkCategory = results[i]['networkCategory']; 
			        table += "<input type='hidden' id='deletenetwork-name' value='"+ networkName +"'>";
			        table += "<tr>";
					table += "<td><input class='network-checkbox' type='checkbox' id='deletenetwork-list' value='"+networkId+"'>"+"</td>";
					table += "<td>"+networkId+"</td>";
					table += "<td></td>";
					table += "<td>"+results[i]['networkName']+"</td>";
					table += "<td></td>";
					table += "<td>"+results[i]['networkCategory']+"</td>";
					table += "<td>"+results[i]['networkType']+"</td>";
					table += "</tr>";
			    }
				return doneCallback(null);
			}
		});
	};
	//http://javascriptplayground.com/blog/2013/06/think-async/
	async.each(actualIds, buildTable, function (err) {
		table += "</table>";
		res.end(table);
	});
}


exports.disconnectIndividualNetworks = function(res,formdata) {

	conn = databaseConnection.getConnectionObject();
	
	var newCombinedName = "";
	var networkName = formdata['networkName'];
	var networkIds = formdata['networkIds']; //All id to be deleted
	
	var splitedIds = splitNetworkID(networkName); //All id in the network

	var updatedElements = removeNetworkID(splitedIds, networkIds);

	newCombinedName = createCombineNetworks(updatedElements);
	
	if(newCombinedName == undefined){
		var queryString = "DELETE FROM network where networkName= '" + networkName + "'";
		var result = databaseConnection.queryDatabase(queryString);
	}else{
		var queryString = "UPDATE network SET networkName= '" + newCombinedName + "' where networkName= '" + networkName + "'";
		var result = databaseConnection.queryDatabase(queryString);
		
		//console.log("RESULT IS "+result);
	}
	res.end("Cluster Updated");	
}

exports.connectNetwork = function(res, formdata) {
	
	//Logic is first to combine the network ids that were clicked
	//If no networks are combined joined the first combine networks
	//split the multiple network names and loop through them
	//loop through the id and check to see that for every id it does not belong in the multiple list
	//console.log("COMBINED NETWORK NAME:  "+combinedName);
	
	conn = databaseConnection.getConnectionObject();
	
	var type = "multiple";
	var singleId = [];
	
	//convert the json formdata into array to be sorted
	var networkIds = [];
	for (var i=0; i < formdata['networkIds'].length; i++) {
		networkIds[i] = formdata['networkIds'][i];
	}
	
	//First create the combined network name with the network ids
	var combinedName = createCombineNetworks(networkIds);
	
	var mergeIds = [];
	var mergeIdsCounter = 0;
	
	var mergeIdDel = [];
	var mergeIdDelCounter = 0;
	
	var networkNameChecker = false;
	var networkIdChecker = false;
	
	var dbNetworkName ="";
	var dbNetworkId = 0;
	
	var sql = "Select * from network where networkCategory= '" + type + "'";
	var numberOfMultiple = 0; //check for the number of multiple networks
	
	var combinedArray = [];
	var combinedArrayCounter = 0;
	
	var finalMergeArray = []; //hold the id of a network and cluster that doesnt exist
	var finalMergeArrayCounter = 0;
	
	var finalDeleteArray = []; //hold the id of a network and cluster that doesnt exist
	var finalDeleteArrayCounter = 0;
	
	var checkedNetworkBoxes = [];
	var checkedNetworkBoxesCounter = 0; //To count the variable holding names of network checkboxes that were checked
	
	var checkedNetworkBoxesDel = [];
	var checkedNetworkBoxesDelCounter = 0; 
	
	var networkCategoryChecker = "single";
	
	conn.query(sql, function(error, results,fields){
		if(error)
			throw error;
		else {
			
			var p=0; 
			
			for (var i in results) { //loop through database records
				
				numberOfMultiple++;
				dbNetworkName = results[i]['networkName'];
				dbNetworkId = results[i]['id'];
				
				//Get only names of the networks that were selected
				for(var k=0; k<networkIds.length; k++){
					if(networkIds[k] == dbNetworkId){
						checkedNetworkBoxes[checkedNetworkBoxesCounter] = dbNetworkName;
						checkedNetworkBoxesDel[checkedNetworkBoxesDelCounter] = dbNetworkId;
					}
				}

				if(results[i]['networkCategory'] =='multiple'){
					networkCategoryChecker = "multiple";
				}
				
				//If network name already exist, then no need to continue so break out of the loop
				if(combinedName == dbNetworkName){
					networkNameChecker = true;
					break;
					
				}else{
					//Split the network name and get their respective ids
			    	var splitedNetworkId = splitNetworkID(dbNetworkName);
			    	
			    	//check to see if any of the network ids checked to be connected already exist in any multiple network
					for(var x=0; x<networkIds.length; x++){
						
						for(var y=0; y<splitedNetworkId.length; y++){
							if(networkIds[x] == splitedNetworkId[y]){
								networkIdChecker = true;
							}
						}
						if(networkIdChecker === true){
							mergeIds[mergeIdsCounter] = dbNetworkName;
							mergeIdsCounter++;
							
							mergeIdDel[mergeIdDelCounter] = dbNetworkId;
							mergeIdDelCounter++;
							break;
						}
					}
				}
				checkedNetworkBoxesCounter++;
				checkedNetworkBoxesDelCounter++;
			}

			//Check if the network with similar name already exist
			if(networkNameChecker ===true){
				console.log("Network Already Exist ");
			}
			
			
			//When the first Cluster is created
			if(numberOfMultiple===0){ 

				//key value pairs for database columns and the values
				var network = {
						networkName: combinedName,
						networkCategory: "multiple"
				};
				var queryString = 'INSERT INTO network set ?';
				var result = databaseConnection.insertRecord(queryString, network);
				
			}
			else{
				
				//If one of the selected networks already exist in any cluster
				if(mergeIdsCounter > 0){
					
					//console.log("SOMETHING NEEDS TO BE DONE --- ID IS IN "+ networkIds);
					
					var newMergeIdLength = mergeIds.length;
					for(var b=0; b<checkedNetworkBoxes.length; b++){
						
						mergeIds[newMergeIdLength] = checkedNetworkBoxes[b];
						mergeIdDel[newMergeIdLength] = checkedNetworkBoxesDel[b];
						
						newMergeIdLength++;
					}
					
					var splitedNetworkIds = [];
	
					for (var j=0; j<mergeIds.length; j++){
						
						if(mergeIds[j] != undefined){
							splitedNetworkIds = splitNetworkID(mergeIds[j]);
							
							for(var p = 0; p<splitedNetworkIds.length; p++){
								combinedArray[combinedArrayCounter] = splitedNetworkIds[p];
								combinedArrayCounter++;
							}
						}
					}
					
					combinedArray = eliminateDuplicates(combinedArray);
					
					var combinName = createCombineNetworks(combinedArray);
					
					var network = {
							networkName: combinName,
							networkCategory: "multiple"
					};

					var queryString = 'INSERT INTO network set ?';
					var result = databaseConnection.insertRecord(queryString, network);
					
					console.log("New Combined Network Created!");
					
					//Delete the previous cluster
					for(var r=0; r<=mergeIdDel.length; r++){
	    				var sqlQuery = "DELETE FROM network where id= '" + mergeIdDel[r] + "'";
	    				var results= databaseConnection.queryDatabase(sqlQuery, network);
					}
					
					/*
					combinedArray = eliminateDuplicates(combinedArray);
					console.log(combinedArray);
					for (var w=0; w<combinedArray.length; w++){
						//console.log(combinedArray[w]);
					}*/
		
				}else{
					//Merging a network with a cluster. The network doesnt exist but the cluster does
					var combinedName2 = [];
					
					var getMultipleId = function (id, doneCallback, test) {
						//console.log("The Network Id is :"+id);
						var sql2 = "Select * from network where id='" + id + "'";
						conn.query(sql2, function(error, results,fields){
							if(error)
								throw error;
							else {
								
								for (var i in results) { //loop through database records
									
									if(results[i]['networkCategory'] == 'single'){
										
										//store network ids that have not been associated with any cluster
							     		finalMergeArray[finalMergeArrayCounter] = id;
										finalMergeArrayCounter++;
									}
									else{
										
										//split the cluster name to get the id of the networks
										var splitNetworkIds = splitNetworkID(results[i]['networkName']);
										
										for(var w = 0; w<splitNetworkIds.length; w++){
											finalMergeArray[finalMergeArrayCounter] = splitNetworkIds[w];
											finalMergeArrayCounter++;
										}
										
										//Store the id of the network so it can be deleted
										finalDeleteArray[finalDeleteArrayCounter] = id ;
										//console.log("ID TO DELETE "+finalDeleteArray);
										finalDeleteArrayCounter++;
									}
									
								}

								combinedName2 = createCombineNetworks(finalMergeArray);
								
								if(combinedName2 != undefined && networkNameChecker !=true){

									//Delete the previous cluster
									for(var r=0; r<=finalDeleteArray.length; r++){
					    				var sqlQuery = "DELETE FROM network where id= '" + finalDeleteArray[r] + "'";
					    				var results= databaseConnection.queryDatabase(sqlQuery, network);
									}
								}

								return doneCallback(null);
							}
						});
					};

					async.each(networkIds, getMultipleId, function (err) {	
						
						if(combinedName2 != undefined && networkNameChecker !=true){
							var network = {
									networkName: combinedName2,
									networkCategory: "multiple"
							};
							
							var queryString = 'INSERT INTO network set ?';
							var result = databaseConnection.insertRecord(queryString, network);
							
							console.log("New Combined Network Created!");
						}
					});
					
				}
			}	
		}	
	});
	res.end();
}

function validateNetworkName(networkName){
	
	conn = databaseConnection.getConnectionObject();
	
	var nameChecker = false;
	var sql = "Select * from network where networkName= '" + networkName + "'";
	
	conn.query(sql, function(error, results,fields){
		if(error)
			throw error;
		else {
			for (var i in results) {
				if(results[i]['networkName'] == networkName){
					nameChecker = true;
					break;
				}
		    }
			return nameChecker;
		}
	});
	
}

function createCombineNetworks(networkIds){
	
	var individualNetwork = "";
	networkIds.sort();
	
	//Check to make sure the user is not trying to create a combined network with 1 network
	if (networkIds.length < 1){
		//console.log("Sorry you Cannot Create a Combined Network with: ("+ networkIds.length + ") Network");
	} else{
		
		for (var x=0; x<networkIds.length; x++){
			
			//Condition to make sure that the dash symbol (-) is not added at the end of last network id
			if(x==(networkIds.length-1)){
				individualNetwork += networkIds[x];
			}else{
				individualNetwork += networkIds[x] + "-";
			}
		}
		//For joined networks
		var combinedName="";
		combinedName = "Cluster:"+individualNetwork; 
		if(combinedName !="")
			return combinedName;
		else
			return 0;
	}
}

function splitNetworkID(networkName){
	
	var check = networkName.search("Cluster:");
	
	if(check == -1){
		return 0;
	}else {
		//Split network into an array so as to extract the networkid
		var temp = networkName.split(":");
		var networkPrefix = temp[0]; //E.g Network:
		var actualIds = temp[1].split("-");
		
		return actualIds;
	}
}

function eliminateDuplicates(arr) {
	  
	var i,
    len=arr.length,
    out=[],
    obj={};

	for (i=0;i<len;i++) {
	  obj[arr[i]]=0;
	}
	for (i in obj) {
	  out.push(i);
	}
	return out;
}

function removeNetworkID(splitedIds, networkIds){
	
	//splitedIds - Name of the array with all the ids
	//networkIds - Name of array with ids to be removed
	
	for(var i=0; i<networkIds.length; i++){
		
		for(var j=0; j<splitedIds.length; j++){
			
			if(networkIds[i] == splitedIds[j]){
				var index = splitedIds.indexOf(networkIds[i]);
				if (index > -1) {
					splitedIds.splice(index, 1);
				}
			}
		}
	}
	return splitedIds;
}


































































