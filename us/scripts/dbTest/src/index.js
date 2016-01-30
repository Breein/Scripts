var db = require('./../../../lib/idb');
var $ = require('./../../../lib/dom');
var ajax = require('./../../../lib/request');
var bindEvent = require('./../../../lib/events');

var $idb, $ts, $dbAnswer;


Function.prototype.gkWait = function(args, g){
  var f = this;
  f.apply(null, args || []).then((result)=>{
    g.next("All Ok");
    //g.next(result);
  });
};

var arr = ["/me/", "/syndicates.php", "/shop.php"];

forEach(arr).then(()=>{
  console.log("ForEach - Ok");
});

function forEach(array){
  var gen;

  return new Promise((resolve)=>{
    gen = parse(arr);
    gen.next();

    function* parse(){
      console.log("Start");
      var a;

      a = yield ajax.gkWait(["http://www.ganjawars.ru" + array[0], "GET", null], gen);

      // some code;

      console.log(a);
      console.log("End\n\n");
      next();
    }

    function next(){
      array.shift();
      if(array.length){
        gen = parse();
        gen.next();
      }else{
        resolve();
      }
    }
  });
}