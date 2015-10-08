(function($) {
 
	
	var dialogs = {
			
		createNetwork: ''	
	};
	
	
	$(document).ready(function(){
		
		// open a dialog 
		dialogs.createNetwork = $( "#createNetworkForm" ).dialog({
	      autoOpen:false,
	      modal:true,
		  height: 300,
	      width: 350,
	      buttons: {
	        Create: function(){
	        	createNetwork();
	        },
	        Cancel: function() {
	        	dialogs.createNetwork.dialog( "close" );
	        }
	      },
	      close: function() {
	    	  dialogs.createNetwork.dialog( "close" );
	      }
	    });
		
		// when create network is clicked
		$("#createNetworkDialog").click(function(){
			// open a dialog 
			dialogs.createNetwork.dialog('open');			
		});
	
	});

	// function to run when create network is clicked on the dialog 
	function createNetwork() {		
		//get user input values
		var networkName = $("#networkname").val();
		var myFormData = {
				
			"networkname": networkName	
		
		};
	
		//alert("Network Name is :"+myFormData.networkname);
		
		// send ajax request to create the network 
		$.ajax({
			type: 'post',
			url: '/Network.js',
			data: { formdata: $("#createNetworkForm").serialize() },
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
				// success:true, message: "successfully created" 
				//dialogs.createNetwork.dialog( "close" );
				//$("#statusBox").html(response.message);
				console.log("CAME TO SUCCESS NOW WORKING");
				//console.log(response.networkname);
			}
		});
		
		dialogs.createNetwork.dialog( "close" );
		
	}
	
	
	
	

	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
})(jQuery);