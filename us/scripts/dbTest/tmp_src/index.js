require('./../../../lib/prototypes')();
var db = require('./../../../lib/idb');
var $ = require('./../../../lib/dom');
var ajax = require('./../../../lib/request');
var bindEvent = require('./../../../lib/events');

var $idb, $ts, $dbAnswer;


var button = $('<input>').attr("type", "button").attr("value", "Click!").node();

document.body.appendChild(button);

bindEvent(button, "onclick", click);

makeConnect("gk_StatsForum", true);

var arr = ["/me/", "/syndicates.php", "/shop.php"];

//arr.reduce((sequence, u) => {
//  return sequence.then(()=>{
//    return forEach(u);
//  });
//}, Promise.resolve()).then(()=>{
//  console.log("ForEach - Ok");
//});

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

function makeConnect(name, first){
  var ini, g;

  ini = [
    {name: "players", key: "id", index: [["name", "a", true]]},
    {name: "forums", key: "id"}
  ];

  g = connect();
  g.next();

  function* connect(){
    if(first){
      console.log(1);
      $idb = yield db.gkWait(g, this, [name]);
      console.log($idb);
      $idb.setIniTableList(ini);
    }
    $idb = yield $idb.connectDB.gkWait(g, $idb);


    var r = yield $idb.getFew.gkWait(g, $idb, ["players", 13579, "d", true]);

    console.log(r);
  }
}

function click(){
  //$idb.setModifyingTableList([
  //  {name: "players", index:[["forums", "d", false]]}
  //]);
  //$idb.db.close();
  //$idb.nextVersion();
  //makeConnect("gk_StatsForum", false);
}