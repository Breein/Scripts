const bindEvent = require('./../../../js/bindEvents.js');
const $ls = require('./../../../js/ls.js');

var $data = {}, $list, $l;

$list = {
  "mushroom": "Грибы",
  "water": "Родниковая вода",
  "weedset": "Травяной сбор",
  "perch": "Вяленая рыба",
  "coffee": "Кофейные зерна",
  "bandage": "Медицинский бинт",
  "travelkit": "Походная аптечка",
  "stimpack_dmg": "Стимпак урона",
  "stimpack_spd": "Стимпак скорости",
  "stimpack_armour": "Стимпак брони",
  "stimpack_iddqd": "Стимпак бессмертия"
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

loadData();
addButtons();

if($data.inProgress){
  using(false);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function addButtons(){
  var nodes, length, id, url, current;
  var gui, td, dur, n, bubble, offset;

  nodes = document.querySelectorAll('a[href*="home.do.php?use="]');
  length = nodes.length;

  while(length--){
    url = nodes[length].href;
    id = url.match(/(.+)\?use=(\d+)&tag=(.+)&l=(.+)/);

    n = id[2];
    $l = id[4];
    id = id[3];

    if($list[id] != null){
      if($data.id == id && $data.n == n){
        current = $data.count;
      }else{
        current = 1;
      }

      td = nodes[length].parentNode.parentNode;
      dur = td.querySelector('font[color="#006600"]').textContent;
      dur = Number(dur) > 50 ? 50 : dur;

      if(td.firstElementChild.tagName.toLocaleLowerCase() == "div"){
        gui = document.createElement('span');
        bubble = ' • ';
        offset = 1;
      }else{
        gui = document.createElement('li');
        bubble = '';
        offset = 0;
      }

      gui.innerHTML = `${bubble}<span style="text-decoration: underline; cursor: pointer;">Использовать</span>: <span style="display: inline-block; width: 30px;">${current}</span>  <span style="font-size: 9px; vertical-align: 1px;">1</span><input type="range" value="${current}" min="1" max="${dur}" step="1" style="vertical-align: -5px;" /><span style="font-size: 9px; vertical-align: 1px;">${dur}</span><br>`;
      gui.setAttribute('style', 'line-height: 30px;');
      td.insertBefore(gui, nodes[length].parentNode.nextElementSibling);

      rangeEvents(gui.childNodes[5 + offset], gui.childNodes[2 + offset]);
      bindEvent(gui.childNodes[0 + offset], "onclick", using, [true, gui.childNodes[2 + offset], id, n]);
    }
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function using(start, node, id, n){
  var count, url, interval;

  if(start){
    count = Number(node.textContent);

    if(!confirm(`Желаете скушать ${count} шт. «${$list[id]}» ?`)) return;

    $data.inProgress = true;
    $data.count = count;
    $data.id = id;
    $data.n = n;

    saveData();
  }

  url = `http://www.ganjawars.ru/home.do.php?use=${$data.n}&tag=${$data.id}&l=${$l}`;
  $data.count = $data.count - 1;

  if($data.count == 0){
    $data.inProgress = false;
    $data.id = '';
    $data.n = '';
  }

  saveData();
  interval = start ? 100 : random(18, 47) * 100 + random(1, 99);

  setTimeout(()=>{
    location.href = url;
  }, interval);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function rangeEvents(node, counter){
  var value, action = [];

  value = 0;

  bindEvent(node, 'onmousedown', down);
  bindEvent(node, 'onchange', change);

  function down(input){
    action[0] = bindEvent(input, 'onmousemove', change);
    action[1] = bindEvent(input, 'onmouseup', up);
  }

  function change(input){
    if(value == input.value) return;

    value = input.value;
    counter.innerHTML = value;
  }

  function up(){
    action[0].unBind();
    action[1].unBind();
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function loadData(){
  $data = $ls.load("gk_eup-data");

  if($data.inProgress == null){
    $data = {
      inProgress: false,
      id: "",
      n: "",
      count: 0
    };

    saveData();
  }
}

function saveData(){
  $ls.save("gk_eup-data", $data);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function random(min, max){ return Math.floor(Math.random() * (max - min + 1)) + min;}