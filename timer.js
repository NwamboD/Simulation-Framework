
var file = require("fs");
var fileName = "SimulationLog";
var contents = file.writeFileSync("./Logs/"+fileName+'.txt', "Text to Write");



/*var items = Array(523,3452,334,31,5346);
var item = items[Math.floor(Math.random()*items.length)];

console.log(item);



var t = require('exectimer'),
    Tick = t.Tick;
 
for(var i = 0; i < 10; i++) {
    Tick.wrap(function myFunction(done) {
    	
    	console.log(i);
      setTimeout(function() {
        done();
      }, 100);
    });
}
 
var results = t.timers.myFunction;


*/

/*

// setting a timeout
setTimeout(function() {
  console.log('Starting Simulation');
}, 1000);
// Setting and clearing an interval
var counter = 0;
var interval = setInterval( function() {
  console.log('Bar', counter);
  counter++;
  if (counter >= 3) {
    clearInterval(interval);
  }
}, 1000);



*/






	/*

	var NanoTimer = require('nanotimer');
	 
	var count = time;
	 
	 
	function main(){
	    var timer = new NanoTimer();
	 
	    timer.setInterval(countDown, '', '1s');
	    timer.setTimeout(liftOff, [timer], ''+count+'s');

	}
	 
	function countDown(){
	    console.log('T - ' + count);
	    count--;
	}
	 
	function liftOff(timer){
	    timer.clearInterval();
	    console.log("Simulation Time has ELAPSED");
	    res.end("Simulation Time has ELAPSED")
	}
	 
	main();
		
	*/































/*

var NanoTimer = require('nanotimer');
 
var count = 10;
 
 
function main(){
    var timer = new NanoTimer();
 
    timer.setInterval(countDown, '', '1s');
    timer.setTimeout(liftOff, [timer], '10s');

}
 
function countDown(){
    console.log('T - ' + count);
    count--;
}
 
function liftOff(timer){
    timer.clearInterval();
    console.log('And we have liftoff!');
}
 
main();


*/