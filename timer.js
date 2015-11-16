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