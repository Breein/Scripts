require('./../../../js/protoDelay.js')();
var $ = require('./../../../js/dom.js');

const $ls = require('./../../../js/ls.js');

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var map = $('table[background*="terrain.gif"]').node();
var gps = $('b:contains("~GPS")').find('font').text();
var sector = $('nobr:contains("~Сектор:")').find('b').text();

console.log(sector);

var $data = $ls.load("gk_WalkmanData");

if($data.map == null){
  $data.map = {};
}

if($data.map[sector] == null){
  createMap(0, 100);
}

addToMap();
printMap(0, 100);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function createMap(min, max){
  var y, x;

  $data.map[sector] = [];

  for(y = min; y < max; y++){
    if($data.map[sector][y] == null) $data.map[sector][y] = [];
    for(x = min; x < max; x++){
      $data.map[sector][y][x] = "#";
    }
  }

  $ls.save("gk_WalkmanData", $data);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function addToMap(){
  var gx, gy;

  gps = gps.split(",");
  gx = Number(gps[0]);
  gy = Number(gps[1]);

  $(map).find('a').each((a)=>{
    var pos, x, y;

    pos = a.href.match(/\?w=(.+)&wx=(.+)&wy=(.+)&xc=(.+)/);
    x = Number(pos[2]) + gx;
    y = Number(pos[3]) + gy;

    $data.map[sector][y][x] = 0;
  });

  $ls.save("gk_WalkmanData", $data);
}




function printMap(min, max){
  var pMap = "", y, x;

  for(y = min; y < max; y++){
    for(x = min; x < max; x++){
      pMap += $data.map[sector][y][x];
    }
    pMap += "\n";
  }

  console.log(pMap);
}

function moveLeft(){

}