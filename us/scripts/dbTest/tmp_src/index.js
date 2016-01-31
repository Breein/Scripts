require('./../../../lib/prototypes')();
var db = require('./../../../lib/idb');
var $ = require('./../../../lib/dom');
var ajax = require('./../../../lib/request');
var bindEvent = require('./../../../lib/events');

var $idb, $ts, $dbAnswer;


var arr = ["/me/", "/syndicates.php", "/shop.php"];

arr.reduce((sequence, u) => {
  return sequence.then(()=>{
    return forEach(u);
  });
}, Promise.resolve()).then(()=>{
  console.log("ForEach - Ok");
});

function forEach(u){
  var g, f;

  f = (resolve) => {
    g = parse();
    g.next();

    function* parse(){
      console.log("Start");
      var a;

      a = yield ajax.gkWait(g, ["http://www.ganjawars.ru" + u, "GET", null]);

      // some code;

      console.log(a);
      console.log("End\n\n");
      resolve();
    }
  };

  return new Promise(f);
}