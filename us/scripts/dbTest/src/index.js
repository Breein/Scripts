var db = require('./../../../lib/idb');
var $ = require('./../../../lib/dom');
var bindEvent = require('./../../../lib/events');

var $idb, $ts, $dbAnswer;






makeTS();

console.log($ts);


makeConnect("Test", true);

var button = $('<input>').attr("type", "button").attr("value", "Click!").node();

document.body.appendChild(button);

bindEvent(button, "onclick", click);

//console.log(db);

function click(){
  console.log("Click!");
  //idb.setRemoveTableList(["addedTable_noIndex", "addedTable", "addedTable_2"]);
  //idb.setModifyingTableList([
  //  {
  //    name: "addedTable_noIndex",
  //    index: [["id", "id", true]]
  //  }
  //]);
  $idb.db.close();
  $idb.version++;
  makeConnect("Test");
}

setTimeout(function(){
  //getData();
  //idb.deleteDB();
}, 500);


async function getData(){

  //console.log("One:");
  //db.add("members", {
  //  id: 1,
  //  a: "Some Member 1",
  //  b: {text: "OK", "date": 2873487}
  //});
  //console.log("Two:");
  //db.add("members", {
  //  id: 2,
  //  a: "Some Member 2",
  //  b: {text: "Not OK", "date": 100000}
  //});
  //console.log("Three:");
  //db.add("members", {
  //  id: 3,
  //  a: "Some Member 3",
  //  b: {text: "OK", "date": 4544545}
  //});
  //console.log("Done:");

  //try{

  //console.log(exist("hdsby", idb.db.objectStoreNames));

  //result = await idb.getFew("members", [[1, "Заблокирован"], [1000000, "Заблокирован"]], 'id, status');

  console.log("Result:");
  if($dbAnswer){
    console.log($dbAnswer);
  }else{
    console.log("Not found!");
  }


  //console.log(result);
}

async function makeConnect(name, first){
  if(first)$idb = await db(name);
  $idb = await $idb.connectDB();

  console.log($idb);
}

function exist(value, array){
  var length;

  length = array.length;

  while(length--){
    if(array[length] == value){
      return true;
    }
  }
  return false;
}