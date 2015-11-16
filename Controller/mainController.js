(function($) {

	var dialogs = {
			
		createNetwork: '',
		connectNetwork: '',
		disconnectNetwork: '',
		addDevice: '',
		joinNetwork: '',
		unJoinNetwork: '',
		registerApplication: '',
		installApplication: '',
		runApplication: '',
		runSimulation: ''
	};
	
	//When the document finish loading
	$(document).ready(function(){
		
		//RUN APPLICATION
		
		  	$("#addOne").click(function(){
		  		IncrementCounterByOne();
		  	});
		  
			// Get the path and load existing data if any
			var path = window.location.pathname;
			if( path == "/network.html" ) {
				getExistingNetworksTable();
			}
			if( path == "/device.html" ) {
				getExistingDevicesTable();
			}
			
			if( path == "/networkdevices.html" ) {
				getExistingNetworkDevicesTable();
			}
			
			if( path == "/application.html" ) {
				browseApplication();
			}
			
			
			/////////////////////////////////////// RUN SIMULATION /////////////////////////////////
			
			
			// when run simulation is clicked
			$("#runSimulationDialog").click(function(){
				dialogs.runSimulation.dialog('open');			
			});
			dialogs.runSimulation = $( "#runSimulationForm" ).dialog({
		      autoOpen:false,
		      modal:true,
			  height: 290,
		      width: 400,
		      buttons: {
		        Simulate: function(){
		        	
		        	runSimulationScript();
		        	
		        },
		        Cancel: function() {
		        	dialogs.runSimulation.dialog( "close" );
		        }
		      },
		      close: function() {
		    	  dialogs.runSimulation.dialog( "close" );
		      }
		    });

			
			/////////////////////////////////////// NETWORK DIAGLOGS /////////////////////////////////
			
			// when create network is clicked
			$("#createNetworkDialog").click(function(){
				dialogs.createNetwork.dialog('open');			
			});
			dialogs.createNetwork = $( "#createNetworkForm" ).dialog({
		      autoOpen:false,
		      modal:true,
			  height: 280,
		      width: 350,
		      buttons: {
		        Create: function(){
		        	if($("#networkname").val()==""){
		    			alert("Please Enter a Network Name");
		    		}else{
		    			createNetwork();
		    		}
		        },
		        Cancel: function() {
		        	dialogs.createNetwork.dialog( "close" );
		        }
		      },
		      close: function() {
		    	  dialogs.createNetwork.dialog( "close" );
		      }
		    });
			
			
			
			// when Connect Network is clicked
			$("#connectNetworkDiaglog").click(function(){
				var data = [];
				var i = 0;
				
		        $('#network-list:checked').each(function(i){
		        	data[i] = $(this).val();
		        });
		        
		        if(data.length < 1){
		        	alert("Select Networks to create a Cluster");
		        }else if(data.length == 1){
		        	alert("Select more than one Network to create a Cluster");
		        }else{
		        	 saveConnectedNetwork(data);
		        }
			});
			
			// Disconnect Network button is clicked
			var networkToDisconnect = [];
			var combinedName = [];
			$("#disconnectNetworkDiaglog").click(function(){
			
				var i = 0;
				
				 $('#network-list:checked').each(function(i){
					 networkToDisconnect[i] = $(this).val();
			     });
				if(networkToDisconnect.length<1 || networkToDisconnect.length>1){
					alert("Error: Select network to disconnect");
				}else{
					getNetworkTableToDisconnect(networkToDisconnect);
				}		
			});
			
			dialogs.disconnectNetwork = $( "#disconnectNetworkForm" ).dialog({
			      autoOpen:false,
			      modal:true,
				  height: 400,
			      width: 550,
			      buttons: {
			        Disconnect: function(){
			        	var j = 0;
			        	var networkToDelete = [];
						 $('#network-list:checked').each(function(i){
							 networkToDelete[i] = $(this).val();
					     });
						 //if(networkToDelete.length<1 || networkToDelete.length>1){
						 if(networkToDelete.length<1){
								alert("Error: Select Network to Disconnect");
						 }else{
							 var k = 0;
							 var networkIdToDelete = [];
							 $('#deletenetwork-list:checked').each(function(i){
								 networkIdToDelete[i] = $(this).val();
						     });
							 
							 if(networkIdToDelete.length<1){
									alert("Please select at least one Network to proceed");
							 }else{
								 var combinedName = $("#deletenetwork-name").val();
								 disconnectIndividualNetworks(networkIdToDelete,combinedName);
							 }
						 }	
			        },
			        Cancel: function() {
			        	dialogs.disconnectNetwork.dialog( "close" );
			        }
			      },
			      close: function() {
			    	  dialogs.disconnectNetwork.dialog( "close" );
			      }
			});
			
			// To delete a single network
			$("#delimg").click(function(e){
			    alert('Clicked to delete image');
			});
			
			
			
			
			
			
			/////////////////////////////////////// DEVICE DIAGLOGS /////////////////////////////////
			
			// When add Device is Clicked
			$("#addDeviceDialog").click(function(){
				getNetworkNames();
				dialogs.addDeviceDialog.dialog('open');			
			});
			
			dialogs.addDeviceDialog = $( "#addDeviceForm" ).dialog({
		      autoOpen:false,
		      modal:true,
			  height: 380,
		      width: 400,
		      buttons: {
		        Create: function(){
					var networkName = $('#join-name :selected').text();
					
					if($("#devicename").val()=="" || $("#devicememory").val()==""){
		    			alert("Please fill in all details");
		    		}else{
						//Pass the network name if the Simulation Administrator chooses to join a device with a network during creation
			        	addDevice(networkName);
		    		}
		        },
		        Cancel: function() {
		        	dialogs.addDeviceDialog.dialog( "close" );
		        }
		      },
		      close: function() {
		    	  dialogs.addDeviceDialog.dialog( "close" );
		      }
		    });
			
			
			// Remove Device Button is clicked
			var deviceToRemove = [];
			$("#removeDeviceDiaglog").click(function(){
			
				var i = 0;
				 $('#device-list:checked').each(function(i){
					 deviceToRemove[i] = $(this).val();
			     });
				if(deviceToRemove.length<1){
					alert("Error: Select device to Remove");
				}else{
					removeDevice(deviceToRemove);
				}		
			});
			
			
			//Join Network
			var deviceToJoin = [];
			$("#joinNetworkDiaglog").click(function(){
			
				var i = 0;
				 $('#device-list:checked').each(function(i){
					 deviceToJoin[i] = $(this).val();
			     });
				if(deviceToJoin.length<1){
					alert("Error: Select device to Remove");
				}else{
					getNetworkNames2();
					dialogs.joinNetwork.dialog( "open" );
				}		
			});
			
			dialogs.joinNetwork = $( "#joinNetworkForm" ).dialog({
			      autoOpen:false,
			      modal:true,
				  height: 230,
			      width: 350,
			      buttons: {
			        Join: function(){
			        	
						var networkName = $('#join-name :selected').text();
			        	joinNetwork(deviceToJoin, networkName);
			        },
			        Cancel: function() {
			        	dialogs.joinNetwork.dialog( "close" );
			        }
			      },
			      close: function() {
			    	  dialogs.joinNetwork.dialog( "close" );
			      }
			});
			
			
			//UnJoin Network
			var deviceToUnJoin = [];
			$("#unJoinNetworkDiaglog").click(function(){
			
				//Selected Device
				var i = 0;
				 $('#device-list:checked').each(function(i){
					 deviceToJoin[i] = $(this).val();
			     });
				if(deviceToJoin.length<1){
					alert("Error: Select device to Unjoin from Network");
				}else{
					getConnectedNetworkNames(deviceToJoin);
					dialogs.unJoinNetwork.dialog( "open" );
				}		
			});
			
			dialogs.unJoinNetwork = $("#unJoinNetworkForm").dialog({
			      autoOpen:false,
			      modal:true,
				  height: 400,
			      width: 550,
			      buttons: {
			        UnJoin: function(){
			        	//Networks in the selected Device
			        	var networkIdToDelete = [];
						 $('#deletenetwork-list:checked').each(function(h){
							 networkIdToDelete[h] = $(this).val();
					     });

						 if(networkIdToDelete.length<1){
								alert("Please select at least one Network to proceed");
						 }else{
							 removeDeviceFromNetwork(networkIdToDelete,deviceToJoin);
						 }
			        },
			        Cancel: function() {
			        	dialogs.unJoinNetwork.dialog( "close" );
			        }
			      },
			      close: function() {
			    	  dialogs.unJoinNetwork.dialog( "close" );
			      }
			});
			
			
			
			
			/////////////////////////////////////// APPLICATION DIAGLOGS /////////////////////////////////
			
			// When Register Application is Clicked
			$("#registerApplicationDialog").click(function(){
				dialogs.registerApplicationDialog.dialog('open');			
			});
			
			dialogs.registerApplicationDialog = $( "#registerApplicationForm" ).dialog({
		      autoOpen:false,
		      modal:true,
			  height: 400,
		      width: 420,
		      buttons: {
		        Register: function(){
		        	if($("#applicationname").val()=="" || $("#applicationdescription").val()=="" || $("#applicationurl").val()==""){
		    			alert("Please fill in all details");
		    		}else{
		    			registerApplication();
		    		}
		        },
		        Cancel: function() {
		        	dialogs.registerApplicationDialog.dialog( "close" );
		        }
		      },
		      close: function() {
		    	  dialogs.registerApplicationDialog.dialog( "close" );
		      }
		    });
			

			// When add Install Application is Clicked
			$("#installApplicationDialog").click(function(){
				getDeviceNames();
				getApplicationNames();
				
				dialogs.installApplication.dialog('open');			
			});
			
			dialogs.installApplication = $( "#installApplicationForm" ).dialog({
		      autoOpen:false,
		      modal:true,
			  height: 280,
		      width: 400,
		      buttons: {
		        Install_Application: function(){
			        installApplication();
		        },
		        Cancel: function() {
		        	dialogs.installApplication.dialog( "close" );
		        }
		      },
		      close: function() {
		    	  dialogs.installApplication.dialog( "close" );
		      }
		    });
			
			
			// When Run Application
			$("#runApplicationDialog").click(function(){
				
				getInstalledDeviceNames();
				getInstalledApplicationNames();
				
				dialogs.runApplication.dialog('open');			
			});
			
			dialogs.runApplication = $( "#runApplicationForm" ).dialog({
		      autoOpen:false,
		      modal:true,
			  height: 280,
		      width: 400,
		      buttons: {
		        Run_Application: function(){
		        	IncrementCounterByOne();
		        },
		        Cancel: function() {
		        	dialogs.runApplication.dialog( "close" );
		        }
		      },
		      close: function() {
		    	  dialogs.runApplication.dialog( "close" );
		      }
		    });
			
			
			
			
			
			
	
	}); //End document load
	
	/*----------------------------------	NETWORK FUNCTIONS	-----------------------------------------------*/
	
	// function to run when create network is clicked on the dialog 
	function createNetwork() {		
		
		//get user input values
		var networkName = $("#networkname").val();
		var myFormData = {
			action: "createNetwork",
			networkname: $("#networkname").val(),
			networktype: $("#networktype").val()
		};
		
		// send ajax request to create the network 
		$.ajax({
			type: 'post',
			url: '/Network.js',
			data: { data: JSON.stringify(myFormData) },
			dataType: 'json',
			error: function(jqXHR, exception){
				var msg = '';
		        if (jqXHR.status === 0) {
		            msg = 'Not connect.\n Verify Network.';
		        } else if (jqXHR.status == 404) {
		            msg = 'Requested page not found. [404]';
		        } else if (jqXHR.status == 500) {
		            msg = 'Internal Server Error [500].';
		        } else if (exception === 'parser error') {
		            msg = 'Requested JSON parse failed.';
		        } else if (exception === 'timeout') {
		            msg = 'Time out error.';
		        } else if (exception === 'abort') {
		            msg = 'Ajax request aborted.';
		        } else {
		            msg = 'Uncaught Error.\n' + jqXHR.responseText;
		        }
				console.log("Some ERROR : "+exception);
			},
			success: function(response){
				//console.log(response.networkname);
			}
		});
		dialogs.createNetwork.dialog( "close" );
		window.location.reload();
	}
	
	
	//Get the networks from database
	function getExistingNetworksTable() {
		
		var myFormdata = {
			action: "getExistingNetworksTable"
		};
		
		$.ajax({
			type: 'post',
			url: '/Network.js',
			data: { data: JSON.stringify(myFormdata) },
			dataType: 'html',
			error: function(jqXHR, exception){
				console.log("Some ERROR : "+exception);
			},
			success: function(response){
				$("#network-table").html(response);
			}
		});
	}
	
	
	//Save connected networks to database 
	function saveConnectedNetwork(data){ //connectNetwork
		
		var myFormdata = {
			action: "connectNetwork",
			networkIds: data
		};
		$.ajax({
			type: 'post',
			url: '/Network.js',
			data: { data: JSON.stringify(myFormdata) },
			dataType: 'html',
			error: function(jqXHR, exception){
				console.log("Some ERROR : "+exception);
			},
			success: function(response){
				window.location.reload();
				//$("#network-table").html(response);
			}
		});

	}
	
	//Get list of Networks to be disconnected 
	function getNetworkTableToDisconnect(data){

		//data is an array
		var myFormdata = {
				action: "disconnectNetwork",
				networkIds: data
		};
		$.ajax({
			type: 'post',
			url:  '/Network.js',
			data: { data: JSON.stringify(myFormdata) },
			dataType: 'html',
			error: function(jqXHR, exception){
				console.log("Some ERROR : "+exception);
			},
			success: function(response){
				console.log(response);
				$("#deletenetwork-table").html(response);
			}
		});
		dialogs.disconnectNetwork.dialog( "open" );
	}
	
	//Disconnect network
	function disconnectIndividualNetworks(data, combinedName){
		
		var myFormdata = {
				action: "disconnectIndividualNetworks",
				networkName: combinedName,
				networkIds: data
		};
		$.ajax({
			type: 'post',
			url:  '/Network.js',
			data: { data: JSON.stringify(myFormdata) },
			dataType: 'text',
			error: function(jqXHR, exception){
				console.log("Some ERROR : "+exception);
			},
			success: function(response){
				alert(response);
				window.location.reload();
			}
		});
		dialogs.disconnectNetwork.dialog( "open" );
	}
		
		


	/*----------------------------------	DEVICE FUNCTIONS	-----------------------------------------------*/
	
	//Get the networks from database
	function getExistingDevicesTable() {
		
		var myFormdata = {
			action: "getExistingDevicesTable"
		};
		
		$.ajax({
			type: 'post',
			url: '/Device.js',
			data: { data: JSON.stringify(myFormdata) },
			dataType: 'html',
			error: function(jqXHR, exception){
				console.log("Some ERROR : "+exception);
			},
			success: function(response){
				$("#device-table").html(response);
			}
		});
	}
	
	// Create Network dialog 
	function addDevice(networkName) {		
		
		//get user input values
		var deviceName = $("#devicename").val();
		var deviceType = $("#devicetype").val();
		var deviceMemory = $("#devicememory").val();

		var myFormData = {
			action: "addDevice",
			networkname: networkName,
			devicename: deviceName,
			devicetype: deviceType,
			devicememory: deviceMemory
		};
		
		// send ajax request to create the network 
		$.ajax({
			type: 'post',
			url: '/Device.js',
			data: { data: JSON.stringify(myFormData) },
			dataType: 'json',
			error: function(jqXHR, exception){
				var msg = '';
				console.log("Some ERROR : "+exception);
			},
			success: function(response){
				//console.log(response.networkname);
			}
		});
		dialogs.addDeviceDialog.dialog( "close" );
		window.location.reload();
	}

	//Remove Device dialog
	function removeDevice(data){
		//alert("Can be disconnected "+combinedName);
		var myFormdata = {
				action: "removeDevice",
				deviceIds: data
		};
		$.ajax({
			type: 'post',
			url:  '/Device.js',
			data: { data: JSON.stringify(myFormdata) },
			dataType: 'text',
			error: function(jqXHR, exception){
				console.log("Some ERROR : "+exception);
			},
			success: function(response){
				alert(response);
				window.location.reload();
			}
		});
	}
	
	
	//Get the Device Names
	function getDeviceNames(){
		
		var data = [];
		var sql="Select * from device";
		data[0] = sql;
		var myFormdata = {
			action: "getDeviceNames",
			query: data
		};
		$.ajax({
			type: 'post',
			url:  '/Device.js',
			data: { data: JSON.stringify(myFormdata) },
			dataType: 'html',
			error: function(jqXHR, exception){
				console.log("Some ERROR : "+exception);
			},
			success: function(response){
				$("#device-names").html(response);
			}
		});
	}
	
	
	//Get the Network Names
	function getNetworkNames(){
		
		var data = [];
		var sql="Select * from network";
		data[0] = sql;
		var myFormdata = {
			action: "getNetworkNames",
			query: data
		};
		$.ajax({
			type: 'post',
			url:  '/Device.js',
			data: { data: JSON.stringify(myFormdata) },
			dataType: 'html',
			error: function(jqXHR, exception){
				console.log("Some ERROR : "+exception);
			},
			success: function(response){
				$(".network-names").html(response);
			}
		});
	}
	
	//Bad coding but just have to get it working for the time being -- Supposed to be DRY
	//Get the Network Names
	function getNetworkNames2(){
		
		var data = [];
		var sql="Select * from network";
		data[0] = sql;
		var myFormdata = {
			action: "getNetworkNames",
			query: data
		};
		$.ajax({
			type: 'post',
			url:  '/Device.js',
			data: { data: JSON.stringify(myFormdata) },
			dataType: 'html',
			error: function(jqXHR, exception){
				console.log("Some ERROR : "+exception);
			},
			success: function(response){
				$(".network-name").html(response);
			}
		});
	}
	
	//Join Network dialog
	function joinNetwork(deviceToJoin, networkName){

		var myFormdata = {
				action: "joinNetwork",
				networkName: networkName,
				deviceIds: deviceToJoin
		};
		$.ajax({
			type: 'post',
			url:  '/Device.js',
			data: { data: JSON.stringify(myFormdata) },
			dataType: 'text',
			error: function(jqXHR, exception){
				console.log("Some ERROR : "+exception);
			},
			success: function(response){
				//alert(window.location);
				window.location.reload();
				window.location.replace("http://localhost:8000/networkdevices.html");
			}
		});
		
	}
	
	
	
	
	/*----------------------------------	NETWORKDEVICES FUNCTIONS	-----------------------------------------------*/
	
	function getExistingNetworkDevicesTable(){
		
		var myFormdata = {
				action: "getExistingNetworkDevicesTable"
			};
			
			$.ajax({
				type: 'post',
				url: '/NetworkDevices.js',
				data: { data: JSON.stringify(myFormdata) },
				dataType: 'html',
				error: function(jqXHR, exception){
					console.log("Some ERROR : "+exception);
				},
				success: function(response){
					$("#connecteddevice-table").html(response);
				}
			});
	}
	
	//Get the Network Names
	function getConnectedNetworkNames(connectedIds){
		
		var myFormdata = {
				action: "getConnectedNetworkNames",
				deviceIds: connectedIds
		};
		
		$.ajax({
			type: 'post',
			url:  '/NetworkDevices.js',
			data: { data: JSON.stringify(myFormdata) },
			dataType: 'html',
			error: function(jqXHR, exception){
				console.log("Some ERROR : "+exception);
			},
			success: function(response){
				$("#connectednetworkdevices-names").html(response);
			}
		});
	}
	
	
	//Remove NetworkDevice dialog
	function removeDeviceFromNetwork(data, deviceId){
		
		var myFormdata = {
				action: "removeDeviceFromNetwork",
				networkIds: data,
				deviceId: deviceId
		};
		$.ajax({
			type: 'post',
			url:  '/NetworkDevices.js',
			data: { data: JSON.stringify(myFormdata) },
			dataType: 'text',
			error: function(jqXHR, exception){
				console.log("Some ERROR : "+exception);
			},
			success: function(response){
				$("#connectednetworkdevices-names").html(response);
				//window.location.reload();
			}
		});
		
	}
	
	
	
	/*----------------------------------	APPLICATION FUNCTIONS	-----------------------------------------------*/
	
	//Browse Application
	function browseApplication(){
		
		var myFormdata = {
				action: "browseApplication"
			};
			
			$.ajax({
				type: 'post',
				url: '/Application.js',
				data: { data: JSON.stringify(myFormdata) },
				dataType: 'html',
				error: function(jqXHR, exception){
					console.log("Some ERROR : "+exception);
				},
				success: function(response){
					$("#application-devices").html(response);
				}
			});
	}
	
	//Get the Application Names
	function getApplicationNames(){
		
		var data = [];
		var sql="Select * from application";
		data[0] = sql;
		var myFormdata = {
			action: "getApplicationNames",
			query: data
		};
		$.ajax({
			type: 'post',
			url:  '/Application.js',
			data: { data: JSON.stringify(myFormdata) },
			dataType: 'html',
			error: function(jqXHR, exception){
				console.log("Some ERROR : "+exception);
			},
			success: function(response){
				$("#application-names").html(response);
			}
		});
	}
	
	//Get the Installed Device Names
	function getInstalledDeviceNames(){
		
		var data = [];
		var sql="Select * from applicationobject";
		data[0] = sql;
		var myFormdata = {
			action: "getInstalledDeviceNames",
			query: data
		};
		$.ajax({
			type: 'post',
			url:  '/Application.js',
			data: { data: JSON.stringify(myFormdata) },
			dataType: 'html',
			error: function(jqXHR, exception){
				console.log("Some ERROR : "+exception);
			},
			success: function(response){
				$("#installeddevice-names").html(response);
			}
		});
	}
	
	//Get the Installed Application Names
	function getInstalledApplicationNames(){
		
		var data = [];
		var sql="Select * from application";
		data[0] = sql;
		var myFormdata = {
			action: "getInstalledApplicationNames",
			query: data
		};
		$.ajax({
			type: 'post',
			url:  '/Application.js',
			data: { data: JSON.stringify(myFormdata) },
			dataType: 'html',
			error: function(jqXHR, exception){
				console.log("Some ERROR : "+exception);
			},
			success: function(response){
				$("#installedapplication-names").html(response);
			}
		});
	}
	
	
	//Get the networks from database
	function registerApplication() {
		
		var myFormdata = {
			action: "registerApplication",
			applicationName: $("#applicationname").val(),
			applicationDescription: $("#applicationdescription").val(),
			applicationURL: $("#applicationurl").val(),
			
		};
		
		$.ajax({
			type: 'post',
			url: '/Application.js',
			data: { data: JSON.stringify(myFormdata) },
			dataType: 'html',
			error: function(jqXHR, exception){
				console.log("Some ERROR : "+exception);
			},
			success: function(response){
				alert(response)
				window.location.reload();
			}
		});
	}
	
	
	// Install Application dialog 
	function installApplication() {		
		
		//get user input values
		var deviceName = $("#device-name").val();
		
		var applicationName = $("#application-name").val();
		//alert(applicationName);
		var myFormData = {
			action: "installApplication",
			devicename: deviceName,
			applicationName: applicationName
		};
		
		// send ajax request to install application
		$.ajax({
			type: 'post',
			url: '/Application.js',
			data: { data: JSON.stringify(myFormData) },
			dataType: 'html',
			error: function(jqXHR, exception){
				var msg = '';
				console.log("Some ERROR : "+exception);
			},
			success: function(response){
				alert(response);
				window.location.reload();
			}
		});
		dialogs.installApplicationDialog.dialog( "close" );
		
	}
	
	//Browse Application
	function IncrementCounterByOne(){
		
		var myFormdata = {
				action: "IncrementCounterByOne",
				installedDeviceName: $("#installeddevice-name").val(),
				installedApplicationName: $("#installedapplication-name").val(),
		};
		$.ajax({
			type: 'post',
			url: '/Application.js',
			data: { data: JSON.stringify(myFormdata) },
			dataType: 'html',
			error: function(jqXHR, exception){
				console.log("Some ERROR : "+exception);
			},
			success: function(response){
				alert(response);
			}
		});
	}
	
	
	/////////// RUN SIMULATION
	
	//Browse Application
	function runSimulationScript(){
		
		var simulationDuration = $("#simulationduration").val();
    	var simulationDurationUnit = $('#simulationdurationunit :selected').text();
    	
    	//alert("Simulation Duration is "+simulationDuration);
    	//alert("Simulation Unit is "+simulationDurationUnit);
    	
		var myFormdata = {
				action: "runSimulationScript",
				simulationDuration: simulationDuration,
				simulationDurationUnit: simulationDurationUnit
		};
		$.ajax({
			type: 'post',
			url: '/Simulation.js',
			data: { data: JSON.stringify(myFormdata) },
			dataType: 'html',
			error: function(jqXHR, exception){
				console.log("Some ERROR : "+exception);
			},
			success: function(response){
				alert(response);
			}
		});
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
})(jQuery);